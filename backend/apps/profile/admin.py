from django.contrib import admin
from .models import FreelancerProfile

@admin.register(FreelancerProfile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["name","title","job_success_score","connects_balance","last_synced_at"]
