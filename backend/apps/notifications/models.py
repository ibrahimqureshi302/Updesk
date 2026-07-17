from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    TYPES = [
        ("message",  "New Message"),
        ("proposal", "Proposal Update"),
        ("client",   "New Client"),
    ]

    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    ntype      = models.CharField(max_length=20, choices=TYPES)
    title      = models.CharField(max_length=255)
    body       = models.TextField()
    read       = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.ntype}] {self.title} — {self.user.username}"


class WhatsAppSettings(models.Model):
    user             = models.OneToOneField(User, on_delete=models.CASCADE, related_name="whatsapp_settings")
    phone_number     = models.CharField(max_length=20, blank=True, help_text="E.164 format, e.g. +14155238886")
    enabled          = models.BooleanField(default=False)
    notify_messages  = models.BooleanField(default=True)
    notify_proposals = models.BooleanField(default=True)
    notify_clients   = models.BooleanField(default=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "whatsapp_settings"

    def __str__(self):
        return f"WhatsApp({self.user.username}, {'on' if self.enabled else 'off'})"
