from .base import *  # noqa

DEBUG = True
ALLOWED_HOSTS = ["*"]

# ── Local database ────────────────────────────────────────────────────────────
# By default we use the PostgreSQL settings from base.py (driven by .env:
# DB_NAME / DB_USER / DB_PASSWORD / DB_HOST / DB_PORT). If you ever need to run
# without a Postgres server, set USE_SQLITE=True in your .env and Django will
# fall back to a local SQLite file instead.
from decouple import config  # noqa: E402

if config("USE_SQLITE", default=False, cast=bool):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Run Celery tasks inline (no Redis/worker needed for quick testing).
# Set both to False once you start a real Redis + Celery worker.
CELERY_TASK_ALWAYS_EAGER     = config("CELERY_EAGER", default=True, cast=bool)
CELERY_TASK_EAGER_PROPAGATES = True
