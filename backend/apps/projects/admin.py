from django.contrib import admin
from .models import Contract, Milestone

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display  = ["title","status","contract_type","currency","start_date"]
    list_filter   = ["status","contract_type"]
    search_fields = ["title"]

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ["title","status","amount","due_date","contract"]
    list_filter  = ["status"]
