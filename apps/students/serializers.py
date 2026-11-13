from django.db import transaction
from rest_framework import serializers
from apps.accounts.models import User
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)

    @transaction.atomic
    def create(self, validated_data):
        first_name = validated_data.pop("first_name", "")
        last_name = validated_data.pop("last_name", "")
        email = validated_data.pop("email", "")
        user = validated_data.pop("user", None)

        if user is None:
            user = User.objects.create_user(
                username=validated_data["registration_number"],
                email=email,
                first_name=first_name,
                last_name=last_name,
                role=User.Role.STUDENT,
            )
        else:
            user.email = email or user.email
            user.first_name = first_name or user.first_name
            user.last_name = last_name or user.last_name
            user.save(update_fields=["email", "first_name", "last_name"])

        validated_data["user"] = user
        return super().create(validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        user = instance.user
        for field in ("email", "first_name", "last_name"):
            if field in validated_data:
                setattr(user, field, validated_data.pop(field))
        user.save(update_fields=["email", "first_name", "last_name"])
        return super().update(instance, validated_data)

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    class Meta:
        model = Student
        fields = [
            "id", "user", "name", "email", "registration_number", "father_name",
            "phone", "department", "semester", "address", "profile_picture",
            "first_name", "last_name",
        ]
