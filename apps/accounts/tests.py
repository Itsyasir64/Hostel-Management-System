from django.test import TestCase
from .models import User


class UserModelTests(TestCase):
    def test_role_defaults_to_staff(self):
        user = User.objects.create_user(username="staff", password="test-password")
        self.assertEqual(user.role, User.Role.STAFF)
