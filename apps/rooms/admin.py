from django.contrib import admin
from .models import Allocation, Bed, Room

admin.site.register([Room, Bed, Allocation])
