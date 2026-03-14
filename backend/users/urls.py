from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    UserDetailView,
    CandidateProfileView,
    RecruiterProfileView,
    RecruiterDashboardView,
    CandidateDashboardView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("me/", UserDetailView.as_view()),
    path("candidate/profile/", CandidateProfileView.as_view()),
    path("recruiter/profile/", RecruiterProfileView.as_view()),
    path("candidate/dashboard/", CandidateDashboardView.as_view()),
    path("recruiter/dashboard/", RecruiterDashboardView.as_view()),
]