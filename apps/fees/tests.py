from datetime import date

from django.test import TestCase

from apps.accounts.models import User
from apps.students.models import Student
from .models import Fee
from .serializers import PaymentSerializer


class FeesModelTests(TestCase):
    def setUp(self):
        user = User.objects.create_user(username="fee-test")
        self.student = Student.objects.create(user=user, registration_number="FEE-1")

    def test_full_payment_marks_fee_paid(self):
        fee = Fee.objects.create(student=self.student, amount="1000.00", due_date=date.today())
        serializer = PaymentSerializer(data={"fee": fee.id, "amount": "1000.00", "payment_method": "cash"})
        self.assertTrue(serializer.is_valid(), serializer.errors)
        serializer.save()
        fee.refresh_from_db()
        self.assertEqual(fee.status, Fee.Status.PAID)
