from django.db import transaction
from rest_framework import serializers
from .models import Fee, Payment


class FeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fee
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Payment amount must be greater than zero.")
        return value

    def create(self, validated_data):
        with transaction.atomic():
            payment = Payment.objects.create(**validated_data)
            fee = payment.fee
            paid = sum(item.amount for item in fee.payments.all())
            fee.status = Fee.Status.PAID if paid >= fee.amount else Fee.Status.PARTIAL
            fee.save(update_fields=["status"])
            return payment

    class Meta:
        model = Payment
        fields = "__all__"
