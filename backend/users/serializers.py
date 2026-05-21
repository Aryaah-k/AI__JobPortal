from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CandidateProfile, RecruiterProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


# -----------------------------
# REGISTER SERIALIZER
# -----------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user


# -----------------------------
# USER SERIALIZER
# -----------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')


# -----------------------------
# JWT LOGIN SERIALIZER (IMPORTANT FIX)
# -----------------------------
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        # 🔥 ADD USER INFO TO RESPONSE
        data['username'] = self.user.username
        data['role'] = self.user.role
        data['email'] = self.user.email

        return data


# -----------------------------
# PROFILES
# -----------------------------
class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = '__all__'


class RecruiterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterProfile
        fields = '__all__'