from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView

from .models import Job
from .serializers import JobSerializer

from matching.models import Match
from matching.serializers import MatchSerializer


# ✅ Create Job
class JobCreateView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ✅ List Jobs - Only show jobs created by the current recruiter
class JobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return jobs created by the current user
        return Job.objects.filter(created_by=self.request.user)


# ✅ Public Job List - Show all jobs to anyone (for public job listing page)
class PublicJobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Return all jobs (not filtered by user)
        return Job.objects.all()


# ✅ Job Detail
class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow access to jobs created by the current user
        return Job.objects.filter(created_by=self.request.user)


# ✅ Job Matches View - Only show matches for jobs created by the current recruiter
class JobMatchesView(ListAPIView):
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        job_id = self.kwargs["pk"]
        # Only show matches for jobs created by the current user
        return Match.objects.filter(job_id=job_id, job__created_by=self.request.user).order_by("-score")


# ✅ Update Job
class JobUpdateView(generics.UpdateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow update of jobs created by the current user
        return Job.objects.filter(created_by=self.request.user)


# ✅ Delete Job
class JobDeleteView(generics.DestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow delete of jobs created by the current user
        return Job.objects.filter(created_by=self.request.user)
