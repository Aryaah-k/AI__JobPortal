from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Job
from .serializers import JobSerializer

from matching.models import Match
from matching.serializers import MatchSerializer


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ==========================
    # RECRUITER JOBS ONLY
    # ==========================
    def get_queryset(self):
        return Job.objects.filter(
            created_by=self.request.user
        ).order_by("-created_at")

    # ==========================
    # AUTO ASSIGN RECRUITER
    # ==========================
    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user
        )

    # ==========================
    # JOB MATCHES
    # ==========================
    @action(detail=True, methods=["get"])
    def matches(self, request, pk=None):
        job = self.get_object()

        matches = Match.objects.filter(
            job=job
        ).order_by("-score")

        serializer = MatchSerializer(
            matches,
            many=True
        )

        return Response(serializer.data)

    # ==========================
    # TOGGLE ACTIVE STATUS
    # ==========================
    @action(detail=True, methods=["patch"])
    def toggle(self, request, pk=None):
        job = self.get_object()

        job.is_active = not job.is_active
        job.save()

        return Response({
            "id": job.id,
            "is_active": job.is_active,
            "message": "Job status updated successfully"
        })

    # ==========================
    # PUBLIC JOB LIST
    # ==========================
    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.AllowAny]
    )
    def public(self, request):

        jobs = Job.objects.all().order_by("-created_at")

        serializer = self.get_serializer(
            jobs,
            many=True
        )

        return Response(serializer.data)