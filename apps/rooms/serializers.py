from django.db import transaction
from rest_framework import serializers
from .models import Allocation, Bed, Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"


class BedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bed
        fields = "__all__"


class AllocationSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        with transaction.atomic():
            bed = validated_data["bed"]
            bed = type(bed).objects.select_for_update().get(pk=bed.pk)
            if bed.status != bed.Status.AVAILABLE:
                raise serializers.ValidationError({"bed": "This bed is not available."})
            if Allocation.objects.filter(student=validated_data["student"], status=Allocation.Status.ACTIVE).exists():
                raise serializers.ValidationError({"student": "This resident already has an active allocation."})
            allocation = Allocation.objects.create(**validated_data)
            bed.status = bed.Status.OCCUPIED
            bed.save(update_fields=["status"])
            return allocation

    class Meta:
        model = Allocation
        fields = "__all__"
