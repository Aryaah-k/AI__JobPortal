from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import get_object_or_404
import re

from .models import Match
from jobs.models import Job
from resumes.models import Resume
from applications.models import Application

from .serializers import MatchSerializer


# =========================
# MATCH JOBS (Keyword based)
# =========================
class MatchJobsView(APIView):

    def post(self, request):
        resume_text = request.data.get("resume_text", "")
        resume_id = request.data.get("resume_id")

        if not resume_text:
            return Response(
                {"error": "No resume text provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        resume = None
        if resume_id:
            try:
                resume = Resume.objects.get(id=int(resume_id))
                Match.objects.filter(resume=resume).delete()
            except (Resume.DoesNotExist, ValueError):
                resume = None

        resume_words = set(re.findall(r"\b\w+\b", resume_text.lower()))

        jobs = Job.objects.all()
        results = []

        for job in jobs:
            if not job.description:
                continue

            job_words = set(re.findall(r"\b\w+\b", job.description.lower()))

            if not job_words:
                continue

            common = resume_words.intersection(job_words)
            score = (len(common) / len(job_words)) * 100

            if score > 10:
                results.append({
                    "id": job.id,
                    "title": job.title,
                    "company": job.company_name,
                    "location": job.location,
                    "score": round(score, 2),
                })

                if resume:
                    Match.objects.create(
                        job=job,
                        resume=resume,
                        score=round(score, 2)
                    )

        results.sort(key=lambda x: x["score"], reverse=True)

        return Response(results, status=status.HTTP_200_OK)


# =========================
# ALL MATCHES
# =========================
class MatchListView(APIView):
    def get(self, request):
        matches = Match.objects.all().order_by("-score")
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)


# =========================
# CANDIDATE MATCHES
# =========================
class CandidateMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            resume = Resume.objects.get(user=request.user)
            matches = Match.objects.filter(resume=resume).order_by("-score")

            serializer = MatchSerializer(matches, many=True)
            return Response(serializer.data)

        except Resume.DoesNotExist:
            return Response(
                {"error": "No resume found"},
                status=status.HTTP_404_NOT_FOUND
            )


# =========================
# RECRUITER JOB MATCHES
# =========================
class RecruiterJobMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):
        job = get_object_or_404(Job, id=job_id)

        applications = Application.objects.filter(job=job)

        matches = []

        for app in applications:
            try:
                resume = Resume.objects.get(user=app.candidate)
                match = Match.objects.filter(job=job, resume=resume).first()

                if match:
                    matches.append(match)

            except Resume.DoesNotExist:
                continue

        matches.sort(key=lambda x: x.score, reverse=True)

        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)


# =========================
# RECRUITER ALL MATCHES
# =========================
class RecruiterAllMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.filter(created_by=request.user)
        applications = Application.objects.filter(job__in=jobs)

        matches = []
        for app in applications:
            try:
                resume = Resume.objects.get(user=app.candidate)
                match = Match.objects.filter(job=app.job, resume=resume).first()
                if match:
                    matches.append(match)
            except Resume.DoesNotExist:
                continue

        matches.sort(key=lambda x: x.score, reverse=True)
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)