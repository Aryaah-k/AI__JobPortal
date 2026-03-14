from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404

from .models import Message, Notification
from .serializers import MessageSerializer
from users.models import User


class SendMessageView(generics.CreateAPIView):
    """Send a message to a candidate"""
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        recipient_id = request.data.get('recipient_id')
        subject = request.data.get('subject')
        body = request.data.get('body')

        if not all([recipient_id, subject, body]):
            return Response(
                {"error": "recipient_id, subject, and body are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        recipient = get_object_or_404(User, id=recipient_id)

        # Save message
        message = Message.objects.create(
            sender=request.user,
            recipient=recipient,
            subject=subject,
            body=body
        )

        # 🔔 Create notification
        Notification.objects.create(
            recipient=recipient,
            notification_type="message_received",
            title="New Message",
            message=f"You received a message from {request.user.username}",
            related_message=message
        )

        return Response({
            "message": "Message sent successfully",
            "id": message.id
        }, status=status.HTTP_201_CREATED)


class SendEmailView(APIView):
    """Send an email to a candidate"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        recipient_email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')

        if not all([recipient_email, subject, message]):
            return Response(
                {"error": "email, subject, and message are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                fail_silently=False,
            )
            return Response({"message": "Email sent successfully"})
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class InboxView(generics.ListAPIView):
    """Get all received messages for the current user"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        return Message.objects.filter(recipient=self.request.user)


class SentMessagesView(generics.ListAPIView):
    """Get all sent messages for the current user"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        return Message.objects.filter(sender=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def unread_notification_count(request):
    """Return unread message count"""
    count = Message.objects.filter(
        recipient=request.user,
        read=False
    ).count()

    return Response({"unread": count})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, notification_id):
    """Mark notification as read"""
    notification = get_object_or_404(
        Notification,
        id=notification_id,
        recipient=request.user
    )

    notification.is_read = True
    notification.save()

    return Response({"message": "Notification marked as read"})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_message_read(request, message_id):
    """Mark message as read"""
    message = get_object_or_404(
        Message,
        id=message_id,
        recipient=request.user
    )

    message.read = True
    message.save()

    return Response({"message": "Message marked as read"})
