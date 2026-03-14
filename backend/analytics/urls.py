from django.urls import path
from .views import (
    DashboardStatsView,
    ApplicationsChartView,
    JobsPerCompanyView,
)

urlpatterns = [
    path("stats/", DashboardStatsView.as_view()),
    path("applications-chart/", ApplicationsChartView.as_view()),
    path("jobs-company-chart/", JobsPerCompanyView.as_view()),
]