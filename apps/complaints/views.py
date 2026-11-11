from rest_framework import viewsets
from .models import Complaint
from .serializers import ComplaintSerializer


class ComplaintViewSet(viewsets.ModelViewSet):
    queryset = Complaint.objects.select_related("student").all()
    serializer_class = ComplaintSerializer
