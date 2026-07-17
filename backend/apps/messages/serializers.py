from rest_framework import serializers
from .models import MessageThread, Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Message
        fields = ["id", "upwork_id", "sender_id", "sender_name", "body", "sent_at"]


class ThreadSerializer(serializers.ModelSerializer):
    contract_title = serializers.CharField(
        source="contract.title", read_only=True, default=""
    )
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model  = MessageThread
        fields = [
            "id", "upwork_room_id", "contract_title",
            "last_preview", "unread_count", "last_synced_at", "messages",
        ]


class UpworkLinkSerializer(serializers.Serializer):
    """Returned by the open-in-upwork endpoint."""
    upwork_url = serializers.URLField(
        help_text="Open this URL in your browser to view the conversation on Upwork."
    )
