from rest_framework import serializers
from .models import Match
from jobs.serializers import JobSerializer


class MatchSerializer(serializers.ModelSerializer):
    candidate_name = serializers.SerializerMethodField()
    job_detail = serializers.SerializerMethodField()
    
    class Meta:
        model = Match
        fields = ["id", "candidate_name", "score", "job", "job_detail", "resume"]

    def get_candidate_name(self, obj):
        try:
            if obj.resume and obj.resume.user:
                return obj.resume.user.username
        except Exception:
            pass
        return "Unknown"
    
    def get_job_detail(self, obj):
        try:
            if obj.job:
                return {
                    "id": obj.job.id,
                    "title": obj.job.title,
                    "company_name": obj.job.company_name,
                    "location": obj.job.location,
                    "description": obj.job.description,
                }
        except Exception:
            pass
        return None
