from django.db import models
from apps.hostel.models import Hostel
from apps.students.models import Student


class Room(models.Model):
    room_number = models.CharField(max_length=20)
    hostel = models.ForeignKey(Hostel, on_delete=models.CASCADE, related_name="rooms")
    floor = models.PositiveIntegerField(default=0)
    capacity = models.PositiveIntegerField(default=1)
    room_type = models.CharField(max_length=50, default="standard")

    class Meta:
        unique_together = ("hostel", "room_number")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        Bed.objects.get_or_create(room=self, bed_number="B1")
        Bed.objects.get_or_create(room=self, bed_number="B2")

    def __str__(self):
        return f"{self.hostel.name} - {self.room_number}"


class Bed(models.Model):
    class Status(models.TextChoices):
        AVAILABLE = "available", "Available"
        OCCUPIED = "occupied", "Occupied"
        MAINTENANCE = "maintenance", "Maintenance"

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="beds")
    bed_number = models.CharField(max_length=20)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.AVAILABLE)

    class Meta:
        unique_together = ("room", "bed_number")


class Allocation(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="allocations")
    bed = models.ForeignKey(Bed, on_delete=models.PROTECT, related_name="allocations")
    check_in_date = models.DateField()
    check_out_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.ACTIVE)
