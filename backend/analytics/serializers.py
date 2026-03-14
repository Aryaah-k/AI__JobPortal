from rest_framework import serializers


class DashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_jobs = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    total_resumes = serializers.IntegerField()


class ChartDataSerializer(serializers.Serializer):
    label = serializers.CharField()
    value = serializers.IntegerField()