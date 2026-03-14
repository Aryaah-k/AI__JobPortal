from django.db.models import Count
from django.db.models.functions import TruncDate
from applications.models import Application
from users.models import User
from jobs.models import Job
from resumes.models import Resume



def get_dashboard_stats():
    return {
        "total_users": User.objects.count(),
        "total_jobs": Job.objects.count(),
        "total_applications": Application.objects.count(),
        "total_resumes": Resume.objects.count(),
    }


def get_applications_per_day():
    data = (
        Application.objects
        .annotate(date=TruncDate("created_at"))
        .values("date")
        .annotate(count=Count("id"))
        .order_by("date")
    )

    return [{"label": str(i["date"]), "value": i["count"]} for i in data]


def get_jobs_per_company():
    data = (
        Job.objects
        .values("company__name")
        .annotate(count=Count("id"))
        .order_by("-count")
    )

    return [{"label": i["company__name"], "value": i["count"]} for i in data]