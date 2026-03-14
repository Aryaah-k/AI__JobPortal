from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response

from .services import (
    get_dashboard_stats,
    get_applications_per_day,
    get_jobs_per_company,
)
from .permissions import IsAdminUser


class DashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = get_dashboard_stats()
        return Response(data)


class ApplicationsChartView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = get_applications_per_day()
        return Response(data)


class JobsPerCompanyView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = get_jobs_per_company()
        return Response(data)
