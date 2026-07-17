from rest_framework import serializers
from .models import Contract, Milestone

class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Milestone
        fields = ["id","upwork_id","title","amount","currency","status","due_date"]

class ContractSerializer(serializers.ModelSerializer):
    milestones  = MilestoneSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source="client.name", read_only=True, default="")
    class Meta:
        model  = Contract
        fields = ["id","upwork_id","title","status","contract_type","hourly_rate",
                  "fixed_price","currency","start_date","end_date","client_name",
                  "milestones","last_synced_at","created_at"]
