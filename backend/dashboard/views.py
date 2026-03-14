from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from jobs.models import Job
from applications.models import Application
from users.permissions import IsAdmin

User = get_user_model()


@api_view(["GET"])
@permission_classes([IsAdmin])
def admin_stats(request):
    data = {
        "total_users": User.objects.count(),
        "total_jobs": Job.objects.count(),
        "total_applications": Application.objects.count(),
    }
    return Response(data)
# Create your views here.
