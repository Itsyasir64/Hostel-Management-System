from django.contrib import admin
from django.shortcuts import render
from django.urls import include, path


def home(request):
    return render(request, "home.html")

urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/accounts/", include("apps.accounts.urls")),
    path("api/students/", include("apps.students.urls")),
    path("api/hostels/", include("apps.hostel.urls")),
    path("api/rooms/", include("apps.rooms.urls")),
    path("api/fees/", include("apps.fees.urls")),
    path("api/complaints/", include("apps.complaints.urls")),
    path("api/visitors/", include("apps.visitors.urls")),
    path("api/reports/", include("apps.reports.urls")),
]
