from rest_framework import serializers
from .models import Application
from users.serializers import UserSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    candidate_detail = UserSerializer(source='candidate', read_only=True)
    job_detail = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = ["id", "candidate", "candidate_detail", "job", "job_detail", "full_name", "email", "phone", "linkedin_profile", "cover_letter", "resume", "documents", "status", "applied_at", "viewed", "viewed_at"]
        read_only_fields = ["candidate", "status", "applied_at", "viewed", "viewed_at"]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make job optional since it's provided by the view URL
        if 'job' in self.fields:
            self.fields['job'].required = False

    def get_job_detail(self, obj):
        return {
            "id": obj.job.id,
            "title": obj.job.title,
            "company_name": obj.job.company_name,
            "location": obj.job.location,
        }
