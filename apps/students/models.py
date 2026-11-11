from django.conf import settings
from django.db import models


class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_profile")
    registration_number = models.CharField(max_length=30, unique=True)
    father_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    department = models.CharField(max_length=150, blank=True)
    semester = models.PositiveSmallIntegerField(null=True, blank=True)
    address = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True)

    def __str__(self):
        return f"{self.registration_number} - {self.user.get_full_name()}"
