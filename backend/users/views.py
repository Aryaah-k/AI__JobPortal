from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from .models import CandidateProfile, RecruiterProfile
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CandidateProfileSerializer,
    RecruiterProfileSerializer,
)
from .permissions import IsCandidate, IsRecruiter

User = get_user_model()



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]



class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = User.objects.filter(username=username).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)

            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "role": user.role,
                "username": user.username,
                "email": user.email,
            })

        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )



class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user



class CandidateProfileView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request):
        profile = CandidateProfile.objects.get(user=request.user)
        serializer = CandidateProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = CandidateProfile.objects.get(user=request.user)
        serializer = CandidateProfileSerializer(
            profile, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)



class RecruiterProfileView(APIView):
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request):
        profile = RecruiterProfile.objects.get(user=request.user)
        serializer = RecruiterProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = RecruiterProfile.objects.get(user=request.user)
        serializer = RecruiterProfileSerializer(
            profile, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)



class RecruiterDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get(self, request):
        return Response({
            "message": "Welcome Recruiter!",
            "user": request.user.username
        })



class CandidateDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request):
        return Response({
            "message": "Welcome Candidate!",
            "user": request.user.username
        })
# Create your views here.
