from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from django.db import IntegrityError
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job
from django.shortcuts import get_object_or_404


class ApplyJobView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"error": "You have already applied for this job"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        job_id = self.kwargs["job_id"]
        job = get_object_or_404(Job, id=job_id)
        application = serializer.save(candidate=self.request.user, job=job)
        
        # Send email to recruiter about new application
        self._send_recruiter_email(job, application)
        
        # Send confirmation email to candidate
        self._send_candidate_confirmation_email(job, application)

    def _send_recruiter_email(self, job, application):
        """Send email to recruiter when a candidate applies"""
        recruiter = job.created_by
        if recruiter.email:
            subject = f"New Application for {job.title}"
            message = (
                f"Hello {recruiter.first_name or recruiter.username},\n\n"
                f"A new candidate has applied for the position of {job.title}.\n\n"
                f"Candidate Name: {application.full_name or f'{application.candidate.first_name} {application.candidate.last_name}'}\n"
                f"Candidate Email: {application.email or application.candidate.email}\n"
                f"Applied At: {application.applied_at}\n\n"
                f"Log in to your dashboard to review the application.\n\n"
                f"Best regards,\n"
                f"Job Portal Team"
            )
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[recruiter.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error sending email to recruiter: {e}")

    def _send_candidate_confirmation_email(self, job, application):
        """Send confirmation email to candidate after applying"""
        candidate = application.candidate
        if candidate.email:
            subject = f"Application Received - {job.title}"
            message = (
                f"Hello {candidate.first_name or candidate.username},\n\n"
                f"Thank you for applying for the position of {job.title} at {job.company_name}.\n\n"
                f"Your application has been successfully submitted.\n\n"
                f"Job Details:\n"
                f"Position: {job.title}\n"
                f"Company: {job.company_name}\n"
                f"Location: {job.location}\n\n"
                f"We will review your application and get back to you soon.\n\n"
                f"Best regards,\n"
                f"Job Portal Team"
            )
            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[candidate.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error sending confirmation email to candidate: {e}")


class JobApplicationsView(APIView):
    """Get all applications for a specific job (for recruiter)"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id, created_by=request.user)
            applications = Application.objects.filter(job=job).select_related('candidate')
            serializer = ApplicationSerializer(applications, many=True)
            return Response(serializer.data)
        except Job.DoesNotExist:
            return Response(
                {"error": "Job not found or you don't have permission"},
                status=status.HTTP_404_NOT_FOUND
            )


class RecruiterApplicationsView(APIView):
    """Get all applications for all jobs created by the recruiter"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        jobs = Job.objects.filter(created_by=request.user)
        applications = Application.objects.filter(job__in=jobs).select_related('candidate', 'job')
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)
