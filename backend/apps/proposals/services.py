import logging
from django.utils import timezone
from apps.sync.graphql import UpworkClient
from apps.sync.queries.proposals import QUERY
from .models import Proposal

logger = logging.getLogger(__name__)

_NOTABLE_STATUSES = {"VIEWED", "SHORTLISTED", "INTERVIEWING", "WON", "DECLINED"}


def sync_proposals(user) -> int:
    data  = UpworkClient(user).query(QUERY)
    count = 0
    for item in data.get("proposals", []):
        job     = item.get("job") or {}
        bid     = item.get("bidAmount") or {}
        new_status = item.get("status", "SUBMITTED")

        existing = Proposal.objects.filter(upwork_id=item["id"]).first()
        old_status = existing.status if existing else None

        obj, created = Proposal.objects.update_or_create(
            upwork_id=item["id"],
            defaults={
                "user":          user,
                "job_title":     job.get("title", ""),
                "job_upwork_id": job.get("id",""),
                "status":        new_status,
                "cover_letter":  item.get("coverLetter",""),
                "bid_amount":    bid.get("amount"),
                "currency":      bid.get("currencyCode","USD"),
                "submitted_at":  item.get("submittedAt"),
                "last_synced_at": timezone.now(),
            },
        )

        if created and new_status in _NOTABLE_STATUSES:
            _notify_proposal(user, obj, new_status, is_new=True)
        elif not created and old_status and old_status != new_status and new_status in _NOTABLE_STATUSES:
            _notify_proposal(user, obj, new_status, is_new=False)

        count += 1
    logger.info("sync_proposals: %d records for user=%s", count, user.username)
    return count


def _notify_proposal(user, proposal, status, is_new):
    try:
        from apps.notifications.services import create_notification
        status_labels = {
            "VIEWED":       "Proposal Viewed",
            "SHORTLISTED":  "Proposal Shortlisted",
            "INTERVIEWING": "Interview Invitation",
            "WON":          "Proposal Won!",
            "DECLINED":     "Proposal Declined",
        }
        label = status_labels.get(status, status.title())
        title = f"{label}: \"{proposal.job_title}\""
        body  = (
            f"Your proposal for \"{proposal.job_title}\" has been {status.lower()}."
            if not is_new
            else f"New proposal \"{proposal.job_title}\" submitted with status {status.lower()}."
        )
        create_notification(user, "proposal", title, body)
    except Exception as e:
        logger.error("Failed to create proposal notification: %s", e)
