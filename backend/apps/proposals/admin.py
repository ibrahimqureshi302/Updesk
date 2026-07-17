from django.contrib import admin
from .models import Proposal

@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display  = ["job_title","status","bid_amount","submitted_at"]
    list_filter   = ["status"]
    search_fields = ["job_title"]
