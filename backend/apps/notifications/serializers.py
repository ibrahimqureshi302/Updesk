from rest_framework import serializers
from .models import Notification, WhatsAppSettings


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = ["id", "ntype", "title", "body", "read", "created_at"]
        read_only_fields = ["id", "ntype", "title", "body", "created_at"]


class WhatsAppSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = WhatsAppSettings
        fields = ["phone_number", "enabled", "notify_messages", "notify_proposals", "notify_clients", "updated_at"]
        read_only_fields = ["updated_at"]
