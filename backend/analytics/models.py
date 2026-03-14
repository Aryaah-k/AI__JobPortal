from django.db import models


class EventLog(models.Model):
    EVENT_TYPES = (
        ("login", "User Login"),
        ("job_posted", "Job Posted"),
        ("application", "Job Application"),
    )

    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    user_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.event_type} - {self.created_at}"
# Create your models here.
