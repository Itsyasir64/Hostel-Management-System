from django.db import models


class DashboardSnapshot(models.Model):
    captured_at = models.DateTimeField(auto_now_add=True)
    total_students = models.PositiveIntegerField(default=0)
    occupied_beds = models.PositiveIntegerField(default=0)
    pending_complaints = models.PositiveIntegerField(default=0)
    outstanding_fees = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    class Meta:
        ordering = ["-captured_at"]
