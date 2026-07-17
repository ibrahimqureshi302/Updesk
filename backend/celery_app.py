"""
Celery application entry point.

Commands (run from the project root with venv active):
  Start worker:     celery -A celery_app worker -l info
  Start scheduler:  celery -A celery_app beat   -l info
"""
import os
from celery import Celery
from apps.sync.schedule import BEAT_SCHEDULE

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

app = Celery("updesk")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
app.conf.beat_schedule = BEAT_SCHEDULE
