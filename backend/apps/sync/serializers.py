from rest_framework import serializers
from .models import SyncLog


class SyncLogSerializer(serializers.ModelSerializer):
    duration_seconds = serializers.SerializerMethodField()

    class Meta:
        model  = SyncLog
        fields = [
            "id", "module", "status", "records_synced",
            "error_message", "started_at", "finished_at", "duration_seconds",
        ]

    def get_duration_seconds(self, obj):
        if obj.finished_at and obj.started_at:
            return round((obj.finished_at - obj.started_at).total_seconds(), 1)
        return None


class SyncStatusSerializer(serializers.Serializer):
    """
    One entry per module showing the latest sync run result.
    Each key is a module name. Value is a SyncLog object or null if never synced.
    """
    profile   = SyncLogSerializer(allow_null=True)
    clients   = SyncLogSerializer(allow_null=True)
    projects  = SyncLogSerializer(allow_null=True)
    messages  = SyncLogSerializer(allow_null=True)
    proposals = SyncLogSerializer(allow_null=True)


class SyncTriggerResponseSerializer(serializers.Serializer):
    """Response returned when a manual sync is triggered."""
    message = serializers.CharField(
        help_text="Confirms the sync job was queued in the background."
    )
