import logging
from django.utils import timezone
from apps.sync.graphql import UpworkClient
from apps.sync.queries.projects import QUERY
from apps.clients.models import Client
from .models import Contract, Milestone

logger = logging.getLogger(__name__)

def sync_projects(user) -> int:
    data  = UpworkClient(user).query(QUERY)
    count = 0
    for item in data.get("contracts", []):
        c_data   = item.get("client") or {}
        client   = None
        if c_data.get("id"):
            client, _ = Client.objects.get_or_create(
                upwork_id=c_data["id"],
                defaults={"user": user, "name": c_data.get("name","")},
            )
        hr  = item.get("hourlyRate") or {}
        fp  = item.get("fixedPrice") or {}
        cur = hr.get("currencyCode") or fp.get("currencyCode","USD")

        contract, _ = Contract.objects.update_or_create(
            upwork_id=item["id"],
            defaults={
                "user": user, "client": client,
                "title":         item.get("title",""),
                "status":        item.get("status","ACTIVE"),
                "contract_type": item.get("contractType","FIXED"),
                "hourly_rate":   hr.get("amount"),
                "fixed_price":   fp.get("amount"),
                "currency":      cur,
                "start_date":    item.get("startDate"),
                "end_date":      item.get("endDate"),
                "last_synced_at": timezone.now(),
            },
        )
        for ms in item.get("milestones",[]):
            amt = ms.get("amount") or {}
            Milestone.objects.update_or_create(
                upwork_id=ms["id"],
                defaults={
                    "contract": contract,
                    "title":    ms.get("title",""),
                    "amount":   amt.get("amount",0),
                    "currency": amt.get("currencyCode","USD"),
                    "status":   ms.get("status","PENDING"),
                    "due_date": ms.get("dueDate"),
                },
            )
        count += 1
    logger.info("sync_projects: %d contracts for user=%s", count, user.username)
    return count
