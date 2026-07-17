from django.contrib import admin
from .models import SyncLog

@admin.register(SyncLog)
class SyncLogAdmin(admin.ModelAdmin):
    list_display  = ["module","status","records_synced","started_at","finished_at"]
    list_filter   = ["module","status"]
    readonly_fields = list_display
