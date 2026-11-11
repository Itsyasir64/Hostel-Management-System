from rest_framework import viewsets
from .models import Hostel
from .serializers import HostelSerializer


class HostelViewSet(viewsets.ModelViewSet):
    queryset = Hostel.objects.all().order_by("name")
    serializer_class = HostelSerializer
