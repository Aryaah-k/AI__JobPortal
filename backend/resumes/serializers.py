from rest_framework import serializers
from .models import Resume
import PyPDF2

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ["file", "extracted_text"]
        read_only_fields = ["extracted_text"]

    def create(self, validated_data):
        resume = Resume.objects.create(**validated_data)

        # Extract text from PDF
        file = resume.file.open("rb")
        reader = PyPDF2.PdfReader(file)

        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        resume.extracted_text = text
        resume.save()

        return resume