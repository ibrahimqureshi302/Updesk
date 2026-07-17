from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display  = ["name","company_name","country","total_hires","last_synced_at"]
    search_fields = ["name","company_name","email"]
    list_filter   = ["country"]
