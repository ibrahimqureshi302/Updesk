from django.contrib import admin
from .models import Notification, WhatsAppSettings


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display  = ("user", "ntype", "title", "read", "created_at")
    list_filter   = ("ntype", "read")
    search_fields = ("user__username", "title", "body")
    readonly_fields = ("created_at",)


@admin.register(WhatsAppSettings)
class WhatsAppSettingsAdmin(admin.ModelAdmin):
    list_display  = ("user", "phone_number", "enabled", "notify_messages", "notify_proposals", "notify_clients", "updated_at")
    list_filter   = ("enabled",)
    search_fields = ("user__username", "phone_number")
