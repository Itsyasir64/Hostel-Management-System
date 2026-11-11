from rest_framework import serializers
from .models import DashboardSnapshot


class DashboardSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardSnapshot
        fields = "__all__"
