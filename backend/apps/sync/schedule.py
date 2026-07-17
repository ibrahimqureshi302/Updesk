"""
Celery Beat schedule.
Each task now runs for ALL users who have a connected Upwork account.
No hardcoded user IDs — new users are picked up automatically.
"""
from celery.schedules import crontab

BEAT_SCHEDULE = {
    "profile-every-6h":    {"task": "sync.profile.scheduled",   "schedule": crontab(minute=0,      hour="*/6")},
    "clients-every-1h":    {"task": "sync.clients.scheduled",   "schedule": crontab(minute=10,     hour="*")},
    "projects-every-1h":   {"task": "sync.projects.scheduled",  "schedule": crontab(minute=25,     hour="*")},
    "messages-every-10m":  {"task": "sync.messages.scheduled",  "schedule": crontab(minute="*/10")},
    "proposals-every-30m": {"task": "sync.proposals.scheduled", "schedule": crontab(minute="*/30")},
}