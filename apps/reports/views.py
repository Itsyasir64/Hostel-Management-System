from rest_framework import viewsets
from .models import DashboardSnapshot
from .serializers import DashboardSnapshotSerializer


class DashboardSnapshotViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DashboardSnapshot.objects.all()
    serializer_class = DashboardSnapshotSerializer
