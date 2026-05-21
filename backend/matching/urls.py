from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    MatchListView,
    MatchJobsView,
    CandidateMatchView,
    RecruiterJobMatchesView,
    RecruiterAllMatchesView
)

from jobs.views import JobViewSet

# =========================
# JOB ROUTER
# =========================
router = DefaultRouter()
router.register(r"jobs", JobViewSet, basename="jobs")

urlpatterns = [
    # ================= MATCH ENDPOINTS
    path("", MatchListView.as_view(), name="match_list"),
    path("jobs/match/", MatchJobsView.as_view(), name="match_jobs"),
    path("candidate/", CandidateMatchView.as_view(), name="candidate_matches"),

    # Recruiter job-specific ranking
    path(
        "recruiter/jobs/<int:job_id>/matches/",
        RecruiterJobMatchesView.as_view(),
        name="recruiter-job-matches"
    ),
    path(
        "recruiter/matches/",
        RecruiterAllMatchesView.as_view(),
        name="recruiter-all-matches"
    ),

    # include router endpoints
    path("", include(router.urls)),
]