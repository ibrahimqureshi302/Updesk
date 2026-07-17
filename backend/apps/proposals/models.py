from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Proposal(models.Model):
    STATUS_CHOICES = [
        ("SUBMITTED","Submitted"),("VIEWED","Viewed"),("SHORTLISTED","Shortlisted"),
        ("INTERVIEWING","Interviewing"),("WON","Won"),("DECLINED","Declined"),("WITHDRAWN","Withdrawn"),
    ]
    user           = models.ForeignKey(User, on_delete=models.CASCADE, related_name="proposals")
    upwork_id      = models.CharField(max_length=120, unique=True)
    job_title      = models.CharField(max_length=500, blank=True)
    job_upwork_id  = models.CharField(max_length=120, blank=True)
    status         = models.CharField(max_length=15, choices=STATUS_CHOICES, default="SUBMITTED")
    cover_letter   = models.TextField(blank=True)
    bid_amount     = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency       = models.CharField(max_length=10, default="USD")
    submitted_at   = models.DateTimeField(null=True, blank=True)
    last_synced_at = models.DateTimeField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "proposals"
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.job_title} — {self.status}"
