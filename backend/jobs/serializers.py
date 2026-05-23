from rest_framework import serializers

from .models import Job
from applications.models import Application
from users.models import User


# ==========================
# CANDIDATE SERIALIZER
# ==========================
class CandidateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
        ]


# ==========================
# APPLICATION SERIALIZER
# ==========================
class ApplicationSerializer(serializers.ModelSerializer):

    candidate_detail = CandidateSerializer(
        source="candidate",
        read_only=True
    )

    class Meta:
        model = Application

        fields = [
            "id",
            "status",
            "applied_at",
            "candidate_detail",
        ]


# ==========================
# JOB SERIALIZER
# ==========================
class JobSerializer(serializers.ModelSerializer):

    applications = serializers.SerializerMethodField()
    total_matches = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = "__all__"
        read_only_fields = ("created_by",)

    # ==========================
    # RECENT APPLICATIONS
    # ==========================
    def get_applications(self, obj):

        applications = (
            Application.objects.filter(job=obj)
            .order_by("-applied_at")[:3]
        )

        return ApplicationSerializer(
            applications,
            many=True
        ).data

    # ==========================
    # TOTAL MATCHES
    # ==========================
    def get_total_matches(self, obj):

        return Application.objects.filter(
            job=obj
        ).count()