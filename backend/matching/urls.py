from django.urls import path
from .views import MatchListView, MatchJobsView, CandidateMatchView

urlpatterns = [
    path("", MatchListView.as_view(), name="match_list"),
    path("jobs/match/", MatchJobsView.as_view(), name="match_jobs"),
    path("candidate/", CandidateMatchView.as_view(), name="candidate_matches"),
]    
