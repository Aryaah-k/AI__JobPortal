from django.urls import path
from .views import JobCreateView, JobListView, JobDetailView, JobMatchesView, PublicJobListView
urlpatterns = [
    path('create/', JobCreateView.as_view(), name='create-job'),  # separate create
    path('', JobListView.as_view(), name='job-list'),              # list jobs (for recruiters)
    path('all/', PublicJobListView.as_view(), name='public-job-list'),  # public job list (for candidates)
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<int:pk>/matches/', JobMatchesView.as_view(), name='job-matches'),
]
