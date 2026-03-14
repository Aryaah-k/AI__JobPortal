from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Match
from jobs.models import Job
from resumes.models import Resume
from .serializers import MatchSerializer
from django.shortcuts import get_object_or_404
import re


class MatchJobsView(APIView):
    """
    Match resume text with jobs using keyword similarity scoring.
    Saves matches to database for persistence.
    """

    def post(self, request):
        resume_text = request.data.get("resume_text")
        resume_id = request.data.get("resume_id")

        if not resume_text:
            return Response(
                {"error": "No resume text provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the resume object if resume_id is provided
        resume = None
        if resume_id:
            try:
                # Convert to integer if it's a string
                if isinstance(resume_id, str):
                    resume_id = int(resume_id)
                resume = Resume.objects.get(id=resume_id)
            except (Resume.DoesNotExist, ValueError, TypeError):
                pass

        # Clean & tokenize resume
        resume_words = set(
            re.findall(r'\b\w+\b', resume_text.lower())
        )

        jobs = Job.objects.all()
        results = []
        
        # Clear old matches for this resume if it exists
        if resume:
            Match.objects.filter(resume=resume).delete()

        for job in jobs:
            if not job.description:
                continue

            job_words = set(
                re.findall(r'\b\w+\b', job.description.lower())
            )

            # Intersection score
            common_words = resume_words.intersection(job_words)

            if len(job_words) == 0:
                score = 0
            else:
                score = (len(common_words) / len(job_words)) * 100

            if score > 10:  # minimum threshold
                match_data = {
                    "id": job.id,
                    "title": job.title,
                    "company": job.company_name,
                    "location": job.location,
                    "score": round(score, 2),
                }
                results.append(match_data)
                
                # Save match to database if resume exists
                if resume:
                    Match.objects.create(
                        job=job,
                        resume=resume,
                        score=round(score, 2)
                    )

        # Sort by score descending
        results = sorted(results, key=lambda x: x["score"], reverse=True)

        return Response(results, status=status.HTTP_200_OK)


class MatchListView(APIView):
    """
    Get all matches (for admin/recruiter view).
    """
    def get(self, request):
        try:
            matches = Match.objects.all().order_by("-score")
            serializer = MatchSerializer(matches, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CandidateMatchView(APIView):
    """
    Get matches for the current logged-in candidate.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get the resume for the current user
            resume = Resume.objects.get(user=request.user)
            matches = Match.objects.filter(resume=resume).order_by("-score")
            serializer = MatchSerializer(matches, many=True)
            return Response(serializer.data)
        except Resume.DoesNotExist:
            return Response(
                {"error": "No resume found for this user"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
