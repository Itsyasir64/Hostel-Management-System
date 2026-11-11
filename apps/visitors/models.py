from django.db import models
from apps.students.models import Student


class Visitor(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="visitors")
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30, blank=True)
    purpose = models.CharField(max_length=255, blank=True)
    entry_time = models.DateTimeField()
    exit_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name
