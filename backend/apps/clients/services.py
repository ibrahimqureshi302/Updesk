import logging
from django.utils import timezone
from apps.sync.graphql import UpworkClient
from apps.sync.queries.clients import QUERY
from .models import Client

logger = logging.getLogger(__name__)

def sync_clients(user) -> int:
    data      = UpworkClient(user).query(QUERY)
    contracts = data.get("contracts", [])
    count = 0
    for contract in contracts:
        c = contract.get("client") or {}
        if not c.get("id"):
            continue
        obj, created = Client.objects.update_or_create(
            upwork_id=c["id"],
            defaults={
                "user":          user,
                "name":          c.get("name",""),
                "email":         c.get("email",""),
                "company_name":  c.get("companyName",""),
                "country":       c.get("country",""),
                "total_hires":   c.get("totalHires",0),
                "total_reviews": c.get("totalReviews",0),
                "last_synced_at": timezone.now(),
            },
        )
        if created:
            _notify_new_client(user, obj)
        count += 1
    logger.info("sync_clients: %d records for user=%s", count, user.username)
    return count


def _notify_new_client(user, client):
    try:
        from apps.notifications.services import create_notification
        name    = client.name or "Unknown"
        company = f" ({client.company_name})" if client.company_name else ""
        title   = f"New client: {name}{company}"
        body    = (
            f"{name} from {client.country} has been added to your clients."
            if client.country
            else f"{name} has been added to your clients."
        )
        create_notification(user, "client", title, body)
    except Exception as e:
        logger.error("Failed to create client notification: %s", e)
