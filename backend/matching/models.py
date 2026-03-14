from django.db import models
from users.models import User
from jobs.models import Job
from resumes.models import Resume


class Match(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    score = models.FloatField()

    class Meta:
        unique_together = ('job', 'resume')
        ordering = ['-score']

    def __str__(self):
        return f"{self.resume.user.email} - {self.job.title} ({self.score})"


# Create your models here.
