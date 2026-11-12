from django.test import TestCase
from django.contrib import admin

from .admin import CustomUserAdmin
from .models import User


class UserModelTests(TestCase):
    def test_role_defaults_to_staff(self):
        user = User.objects.create_user(username="staff", password="test-password")
        self.assertEqual(user.role, User.Role.STAFF)


class UserAdminTests(TestCase):
    def test_user_admin_is_registered_with_custom_admin(self):
        self.assertIsInstance(admin.site._registry[User], CustomUserAdmin)

    def test_user_admin_displays_and_filters_by_role(self):
        self.assertIn("role", CustomUserAdmin.list_display)
        self.assertIn("role", CustomUserAdmin.list_filter)

    def test_user_admin_includes_role_in_create_and_edit_forms(self):
        self.assertIn("role", str(CustomUserAdmin.fieldsets))
        self.assertIn("role", str(CustomUserAdmin.add_fieldsets))
