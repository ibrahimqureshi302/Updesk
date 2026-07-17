from django.db import models
from django.contrib.auth import get_user_model
from apps.projects.models import Contract
User = get_user_model()

class MessageThread(models.Model):
    user           = models.ForeignKey(User, on_delete=models.CASCADE, related_name="threads")
    contract       = models.OneToOneField(Contract, on_delete=models.SET_NULL, null=True, blank=True, related_name="thread")
    upwork_room_id = models.CharField(max_length=120, unique=True)
    last_preview   = models.TextField(blank=True)
    unread_count   = models.IntegerField(default=0)
    last_synced_at = models.DateTimeField(null=True, blank=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "message_threads"
        ordering = ["-updated_at"]

class Message(models.Model):
    thread      = models.ForeignKey(MessageThread, on_delete=models.CASCADE, related_name="messages")
    upwork_id   = models.CharField(max_length=120, unique=True)
    sender_id   = models.CharField(max_length=120)
    sender_name = models.CharField(max_length=255)
    body        = models.TextField()
    sent_at     = models.DateTimeField()
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "messages"
        ordering = ["sent_at"]
