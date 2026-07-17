from rest_framework import serializers
from .models import Proposal


class ProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Proposal
        fields = [
            "id", "upwork_id", "job_title", "job_upwork_id",
            "status", "cover_letter", "bid_amount", "currency",
            "submitted_at", "last_synced_at",
        ]


class ProposalStatsSerializer(serializers.Serializer):
    """Win rate and per-status counts for the proposal pipeline panel."""
    total    = serializers.IntegerField(help_text="Total proposals submitted")
    won      = serializers.IntegerField(help_text="Proposals that converted to contracts")
    win_rate = serializers.FloatField(help_text="Win percentage e.g. 12.5 means 12.5%")
    by_status = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="Count of proposals in each status stage"
    )


class ProposalUpworkLinkSerializer(serializers.Serializer):
    """Direct link to view the proposal on Upwork."""
    upwork_url = serializers.URLField(
        help_text="Open this URL to view the job posting on Upwork."
    )
