from django.urls import path
from .views import (
    SendMessageView,
    SendEmailView,
    InboxView,
    SentMessagesView,
    unread_notification_count,
    mark_notification_read,
    mark_message_read
)

urlpatterns = [
    path("send/", SendMessageView.as_view()),
    path("email/", SendEmailView.as_view()),
    path("inbox/", InboxView.as_view()),
    path("sent/", SentMessagesView.as_view()),
    path("unread-count/", unread_notification_count),
    path("read/<int:notification_id>/", mark_notification_read),
    path("message/read/<int:message_id>/", mark_message_read),
]
