from django.db import models
from django.contrib.auth import get_user_model
from apps.clients.models import Client
User = get_user_model()

class Contract(models.Model):
    TYPE_CHOICES   = [("HOURLY","Hourly"),("FIXED","Fixed Price")]
    STATUS_CHOICES = [("ACTIVE","Active"),("PAUSED","Paused"),("ENDED","Ended"),("CANCELLED","Cancelled")]

    user          = models.ForeignKey(User, on_delete=models.CASCADE, related_name="contracts")
    client        = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, blank=True, related_name="contracts")
    upwork_id     = models.CharField(max_length=120, unique=True)
    title         = models.CharField(max_length=500)
    status        = models.CharField(max_length=15, choices=STATUS_CHOICES, default="ACTIVE")
    contract_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="FIXED")
    hourly_rate   = models.DecimalField(max_digits=8,  decimal_places=2, null=True, blank=True)
    fixed_price   = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    currency      = models.CharField(max_length=10, default="USD")
    start_date    = models.DateField(null=True, blank=True)
    end_date      = models.DateField(null=True, blank=True)
    last_synced_at = models.DateTimeField(null=True, blank=True)
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "contracts"
        ordering = ["-start_date"]

    def __str__(self):
        return self.title


class Milestone(models.Model):
    STATUS_CHOICES = [
        ("PENDING","Pending"),("FUNDED","Funded"),("IN_REVIEW","In Review"),
        ("APPROVED","Approved"),("RELEASED","Released"),("DISPUTED","Disputed"),
    ]
    contract   = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="milestones")
    upwork_id  = models.CharField(max_length=120, unique=True)
    title      = models.CharField(max_length=500)
    amount     = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency   = models.CharField(max_length=10, default="USD")
    status     = models.CharField(max_length=15, choices=STATUS_CHOICES, default="PENDING")
    due_date   = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "milestones"
        ordering = ["due_date"]

    def __str__(self):
        return f"{self.contract.title} — {self.title}"
