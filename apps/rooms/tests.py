from datetime import date

from django.test import TestCase

from apps.accounts.models import User
from apps.hostel.models import Hostel
from apps.students.models import Student
from .models import Bed, Room
from .serializers import AllocationSerializer


class RoomModelTests(TestCase):
    def setUp(self):
        user = User.objects.create_user(username="room-test")
        self.student = Student.objects.create(user=user, registration_number="ROOM-1")
        hostel = Hostel.objects.create(name="Test Hostel", address="Test address")
        room = Room.objects.create(hostel=hostel, room_number="101")
        self.bed = Bed.objects.create(room=room, bed_number="A")

    def test_allocation_occupies_bed(self):
        serializer = AllocationSerializer(data={"student": self.student.id, "bed": self.bed.id, "check_in_date": date.today(), "status": "active"})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        allocation = serializer.save()
        self.bed.refresh_from_db()
        self.assertEqual(allocation.bed, self.bed)
        self.assertEqual(self.bed.status, Bed.Status.OCCUPIED)

    def test_room_has_two_standard_beds(self):
        room = Room.objects.create(hostel=self.bed.room.hostel, room_number="102")
        self.assertEqual(list(room.beds.values_list("bed_number", flat=True)), ["B1", "B2"])
