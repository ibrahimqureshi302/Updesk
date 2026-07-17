from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class SyncLog(models.Model):
    MODULE_CHOICES = [
        ("profile","Profile"),("clients","Clients"),("projects","Projects"),
        ("earnings","Earnings"),("messages","Messages"),("proposals","Proposals"),
    ]
    STATUS_CHOICES = [("RUNNING","Running"),("SUCCESS","Success"),("ERROR","Error")]

    user           = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sync_logs")
    module         = models.CharField(max_length=20, choices=MODULE_CHOICES)
    status         = models.CharField(max_length=10, choices=STATUS_CHOICES, default="RUNNING")
    records_synced = models.IntegerField(default=0)
    error_message  = models.TextField(blank=True)
    started_at     = models.DateTimeField(auto_now_add=True)
    finished_at    = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "sync_logs"
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.module} — {self.status}"
