from rest_framework import serializers
from .models import FreelancerProfile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = FreelancerProfile
        fields = ["id","upwork_id","name","email","title","description","hourly_rate",
                  "currency","job_success_score","total_earnings","total_jobs",
                  "connects_balance","member_since","profile_url","skills","last_synced_at"]
