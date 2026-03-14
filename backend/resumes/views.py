from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from users.permissions import IsCandidate
from .models import Resume
from .serializers import ResumeSerializer
from .utils import extract_text_from_pdf


class UploadResumeView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response({"error": "No file provided"}, status=400)

        resume, created = Resume.objects.get_or_create(user=request.user)
        resume.file = file
        resume.save()

        # Extract text
        extracted_text = extract_text_from_pdf(resume.file.path)
        resume.extracted_text = extracted_text
        resume.save()

        return Response({
            "message": "Resume uploaded successfully",
            "resume_id": resume.id,
            "extracted_text": extracted_text,
            "extracted_characters": len(extracted_text)
        }, status=status.HTTP_201_CREATED)
# Create your views here.
