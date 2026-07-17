from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Client(models.Model):
    user           = models.ForeignKey(User, on_delete=models.CASCADE, related_name="clients")
    upwork_id      = models.CharField(max_length=120, unique=True)
    name           = models.CharField(max_length=255, blank=True)
    email          = models.EmailField(blank=True)
    company_name   = models.CharField(max_length=255, blank=True)
    country        = models.CharField(max_length=100, blank=True)
    total_hires    = models.IntegerField(default=0)
    total_reviews  = models.IntegerField(default=0)
    notes          = models.TextField(blank=True)      # private; never sent to Upwork
    last_synced_at = models.DateTimeField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "clients"
        ordering = ["-updated_at"]

    def __str__(self):
        return self.name or self.company_name or self.upwork_id
