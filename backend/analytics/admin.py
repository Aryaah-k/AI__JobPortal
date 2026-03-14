from django.contrib import admin

from .models import EventLog


@admin.register(EventLog)
class EventLogAdmin(admin.ModelAdmin):
    list_display = ("event_type", "user_id", "created_at")
    list_filter = ("event_type",)
# Register your models here.
