from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("registration_number", "student_name", "department", "semester", "phone")
    list_filter = ("department", "semester")
    search_fields = ("registration_number", "user__username", "user__first_name", "user__last_name", "user__email")
    list_select_related = ("user",)

    @admin.display(description="Student", ordering="user__last_name")
    def student_name(self, obj):
        return obj.user.get_full_name() or obj.user.username
