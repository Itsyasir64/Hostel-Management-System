from rest_framework import viewsets
from .models import Visitor
from .serializers import VisitorSerializer


class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.select_related("student").all().order_by("-entry_time")
    serializer_class = VisitorSerializer
