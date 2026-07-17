from django.contrib import admin
from .models import UpworkToken

@admin.register(UpworkToken)
class UpworkTokenAdmin(admin.ModelAdmin):
    list_display    = ["user", "expires_at", "updated_at"]
    readonly_fields = ["user", "expires_at", "scope", "created_at", "updated_at"]
    exclude         = ["_access_token", "_refresh_token"]  # never show raw encrypted data
