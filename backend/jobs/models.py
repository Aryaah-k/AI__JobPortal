from django.db import models
from django.conf import settings


class Job(models.Model):
    CATEGORY_CHOICES = (
        ("frontend", "Frontend Development"),
        ("backend", "Backend Development"),
        ("fullstack", "Full Stack Development"),
        ("ai", "Artificial Intelligence"),
        ("ml", "Machine Learning"),
        ("devops", "DevOps Engineering"),
        ("cloud", "Cloud Computing"),
        ("uiux", "UI/UX Design"),
    )

    JOB_TYPE_CHOICES = (
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('internship', 'Internship'),
        ('remote', 'Remote'),
    )

    title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField()
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='jobs'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return  f"{self.title} - {self.company_name}"