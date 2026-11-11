from django.db import models


class Hostel(models.Model):
    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"
        MIXED = "mixed", "Mixed"

    name = models.CharField(max_length=150)
    address = models.TextField()
    gender = models.CharField(max_length=10, choices=Gender.choices, default=Gender.MIXED)
    total_rooms = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name
