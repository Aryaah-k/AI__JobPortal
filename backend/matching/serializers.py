# pyrefly: ignore [missing-import]
from rest_framework import serializers
from .models import Match

class MatchSerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    candidate_id = serializers.SerializerMethodField()
    candidate_email = serializers.SerializerMethodField()
    job_detail = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = [
            "id",
            "candidate_name",
            "candidate_id",
            "candidate_email",
            "score",
            "job",
            "job_detail",
            "resume",
        ]

    def get_candidate_name(self, obj):
        if obj.resume and obj.resume.user:
            return obj.resume.user.username
        return "Unknown"

    def get_candidate_id(self, obj):
        if obj.resume and obj.resume.user:
            return obj.resume.user.id
        return None

    def get_candidate_email(self, obj):
        if obj.resume and obj.resume.user:
            return obj.resume.user.email
        return ""

    def get_job_detail(self, obj):
        if obj.job:
            return {
                "id": obj.job.id,
                "title": obj.job.title,
                "company_name": obj.job.company_name,
                "location": obj.job.location,
                "description": obj.job.description,
                "is_active": obj.job.is_active,
                "salary": obj.job.salary,
                "job_type": obj.job.job_type,
            }
        return None