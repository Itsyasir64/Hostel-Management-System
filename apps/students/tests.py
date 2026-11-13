from django.test import TestCase
from rest_framework.test import APIClient

from apps.accounts.models import User
from .models import Student

class StudentModelTests(TestCase):
    def test_student_profile_creates_student_user(self):
        response = APIClient().post("/api/students/", {
            "registration_number": "STU-001",
            "first_name": "Amina",
            "last_name": "Khan",
            "email": "amina@example.com",
            "department": "Computer Science",
            "semester": 2,
        }, format="json")

        self.assertEqual(response.status_code, 201)
        student = Student.objects.get(registration_number="STU-001")
        self.assertEqual(student.user.role, User.Role.STUDENT)
        self.assertEqual(student.user.get_full_name(), "Amina Khan")
        self.assertEqual(student.user.email, "amina@example.com")

    def test_student_profile_update_changes_user_details(self):
        user = User.objects.create_user(username="STU-002", first_name="Old")
        student = Student.objects.create(user=user, registration_number="STU-002")

        response = APIClient().patch(f"/api/students/{student.pk}/", {
            "first_name": "New",
            "email": "new@example.com",
        }, format="json")

        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertEqual(user.first_name, "New")
        self.assertEqual(user.email, "new@example.com")
