import logging
from django.utils import timezone
from django.db.models import F
from apps.sync.graphql import UpworkClient
from apps.sync.queries.messages import QUERY
from apps.projects.models import Contract
from .models import MessageThread, Message

logger = logging.getLogger(__name__)


def sync_messages(user) -> int:
    client = UpworkClient(user)
    count  = 0
    for contract in Contract.objects.filter(user=user, status="ACTIVE"):
        try:
            data = client.query(QUERY, variables={"contractId": contract.upwork_id})
        except Exception as e:
            logger.warning("messages sync failed for contract %s: %s", contract.upwork_id, e)
            continue
        msgs = data.get("messages", [])
        if not msgs:
            continue
        thread, _ = MessageThread.objects.update_or_create(
            upwork_room_id=contract.upwork_id,
            defaults={
                "user":          user,
                "contract":      contract,
                "last_preview":  (msgs[-1].get("body","") or "")[:200],
                "last_synced_at": timezone.now(),
            },
        )
        new_msgs = 0
        last_sender = ""
        last_preview = ""
        for m in msgs:
            sender = m.get("sender") or {}
            _, created = Message.objects.update_or_create(
                upwork_id=m["id"],
                defaults={
                    "thread":      thread,
                    "sender_id":   sender.get("id",""),
                    "sender_name": sender.get("name",""),
                    "body":        m.get("body",""),
                    "sent_at":     m.get("createdAt"),
                },
            )
            if created:
                new_msgs   += 1
                last_sender  = sender.get("name","Someone")
                last_preview = (m.get("body","") or "")[:120]
            count += 1

        if new_msgs:
            MessageThread.objects.filter(pk=thread.pk).update(
                unread_count=F('unread_count') + new_msgs
            )
            _notify_new_messages(user, contract.title, new_msgs, last_sender, last_preview)

    logger.info("sync_messages: %d messages for user=%s", count, user.username)
    return count


def _notify_new_messages(user, contract_title, count, sender, preview):
    try:
        from apps.notifications.services import create_notification
        title = f"New message on \"{contract_title}\""
        body  = f"{sender}: {preview}" if preview else f"{count} new message(s) received."
        create_notification(user, "message", title, body)
    except Exception as e:
        logger.error("Failed to create message notification: %s", e)
