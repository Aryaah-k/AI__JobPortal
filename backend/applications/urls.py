from django.urls import path
from .views import ApplyJobView, JobApplicationsView, RecruiterApplicationsView

urlpatterns = [
    path("apply/<int:job_id>/", ApplyJobView.as_view(), name="apply-job"),
    path("job/<int:job_id>/", JobApplicationsView.as_view(), name="job-applications"),
    path("recruiter/", RecruiterApplicationsView.as_view(), name="recruiter-applications"),
]
