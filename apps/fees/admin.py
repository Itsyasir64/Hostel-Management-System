from django.contrib import admin
from .models import Fee, Payment

admin.site.register([Fee, Payment])
