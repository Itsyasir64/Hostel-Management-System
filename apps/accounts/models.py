from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", "Super Admin"
        HOSTEL_ADMIN = "hostel_admin", "Hostel Admin"
        WARDEN = "warden", "Warden"
        ACCOUNTANT = "accountant", "Accountant"
        STAFF = "staff", "Staff"
        STUDENT = "student", "Student"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STAFF)

    def __str__(self):
        return self.get_full_name() or self.username
