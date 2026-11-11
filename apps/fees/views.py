from rest_framework import viewsets
from .models import Fee, Payment
from .serializers import FeeSerializer, PaymentSerializer


class FeeViewSet(viewsets.ModelViewSet):
    queryset = Fee.objects.select_related("student").all()
    serializer_class = FeeSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.select_related("fee").all()
    serializer_class = PaymentSerializer
