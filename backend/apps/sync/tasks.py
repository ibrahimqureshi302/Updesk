"""
Celery tasks — one per module.
Each task wraps its service function in a SyncLog entry.
"""
import logging
from django.utils import timezone
from django.contrib.auth import get_user_model
from celery import shared_task
from .models import SyncLog

logger = logging.getLogger(__name__)
User = get_user_model()


def _run(module: str, fn, user):
    """Run a sync function, record result in SyncLog."""
    log = SyncLog.objects.create(user=user, module=module, status="RUNNING")
    try:
        count          = fn(user) or 0
        log.status         = "SUCCESS"
        log.records_synced = count
    except Exception as e:
        log.status        = "ERROR"
        log.error_message = str(e)
        logger.error("Sync error [%s] user=%s: %s", module, user.username, e)
    finally:
        log.finished_at = timezone.now()
        log.save(update_fields=["status","records_synced","error_message","finished_at"])


@shared_task(name="sync.profile")
def task_profile(user_id: int):
    from apps.profile.services import sync_profile
    _run("profile", sync_profile, User.objects.get(pk=user_id))

@shared_task(name="sync.clients")
def task_clients(user_id: int):
    from apps.clients.services import sync_clients
    _run("clients", sync_clients, User.objects.get(pk=user_id))

@shared_task(name="sync.projects")
def task_projects(user_id: int):
    from apps.projects.services import sync_projects
    _run("projects", sync_projects, User.objects.get(pk=user_id))

@shared_task(name="sync.messages")
def task_messages(user_id: int):
    from apps.messages.services import sync_messages
    _run("messages", sync_messages, User.objects.get(pk=user_id))

@shared_task(name="sync.proposals")
def task_proposals(user_id: int):
    from apps.proposals.services import sync_proposals
    _run("proposals", sync_proposals, User.objects.get(pk=user_id))

@shared_task(name="sync.all")
def task_sync_all(user_id: int):
    """Full sync — triggered by the 'Sync Now' button in the dashboard."""
    for task in [task_profile, task_clients, task_projects, task_messages, task_proposals]:
        task(user_id)


# ── Scheduled variants — run for every connected user ─────────────────────────

def _connected_user_ids() -> list[int]:
    """Return IDs of all users who have a connected Upwork token."""
    from apps.authentication.models import UpworkToken
    return list(UpworkToken.objects.values_list("user_id", flat=True))


@shared_task(name="sync.profile.scheduled")
def task_profile_scheduled():
    for uid in _connected_user_ids():
        task_profile(uid)

@shared_task(name="sync.clients.scheduled")
def task_clients_scheduled():
    for uid in _connected_user_ids():
        task_clients(uid)

@shared_task(name="sync.projects.scheduled")
def task_projects_scheduled():
    for uid in _connected_user_ids():
        task_projects(uid)

@shared_task(name="sync.messages.scheduled")
def task_messages_scheduled():
    for uid in _connected_user_ids():
        task_messages(uid)

@shared_task(name="sync.proposals.scheduled")
def task_proposals_scheduled():
    for uid in _connected_user_ids():
        task_proposals(uid)
