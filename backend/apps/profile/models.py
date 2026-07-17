from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class FreelancerProfile(models.Model):
    user              = models.OneToOneField(User, on_delete=models.CASCADE, related_name="freelancer_profile")
    upwork_id         = models.CharField(max_length=120, unique=True)
    name              = models.CharField(max_length=255, blank=True)
    email             = models.EmailField(blank=True)
    title             = models.CharField(max_length=500, blank=True)
    description       = models.TextField(blank=True)
    hourly_rate       = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    currency          = models.CharField(max_length=10, default="USD")
    job_success_score = models.FloatField(null=True, blank=True)
    total_earnings    = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    total_jobs        = models.IntegerField(default=0)
    connects_balance  = models.IntegerField(default=0)
    member_since      = models.DateField(null=True, blank=True)
    profile_url       = models.URLField(blank=True)
    skills            = models.JSONField(default=list)
    last_synced_at    = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "freelancer_profiles"

    def __str__(self):
        return self.name or self.upwork_id
