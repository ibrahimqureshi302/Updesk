from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Client
        fields = ["id","upwork_id","name","email","company_name","country",
                  "total_hires","total_reviews","notes","last_synced_at","updated_at"]
        read_only_fields = ["id","upwork_id","name","email","company_name",
                            "country","total_hires","total_reviews","last_synced_at","updated_at"]
