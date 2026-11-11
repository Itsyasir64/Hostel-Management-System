from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)
    first_name = serializers.CharField(write_only=True, required=False)
    last_name = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(write_only=True, required=False)

    def create(self, validated_data):
        validated_data.pop("first_name", None)
        validated_data.pop("last_name", None)
        validated_data.pop("email", None)
        return super().create(validated_data)

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    class Meta:
        model = Student
        fields = [
            "id", "user", "name", "email", "registration_number", "father_name",
            "phone", "department", "semester", "address", "profile_picture",
            "first_name", "last_name",
        ]
