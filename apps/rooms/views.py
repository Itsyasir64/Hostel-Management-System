from rest_framework import viewsets
from .models import Allocation, Bed, Room
from .serializers import AllocationSerializer, BedSerializer, RoomSerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.select_related("hostel").all()
    serializer_class = RoomSerializer


class BedViewSet(viewsets.ModelViewSet):
    queryset = Bed.objects.select_related("room").all()
    serializer_class = BedSerializer


class AllocationViewSet(viewsets.ModelViewSet):
    queryset = Allocation.objects.select_related("student", "bed").all()
    serializer_class = AllocationSerializer
