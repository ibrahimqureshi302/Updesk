# UpDesk — Running on Ubuntu 26.04

UpDesk is an Upwork account-management dashboard: a **Django REST** backend
(PostgreSQL + Celery/Redis) and a **React + Vite** frontend.

This guide gets the whole stack running on a fresh **Ubuntu 26.04** machine.

---

## 1. Prerequisites

Ubuntu 26.04 ships with **Python 3.14**, which is what this project targets.
You also need PostgreSQL, Redis and Node.js — the setup script installs all of
them for you.

| Component   | Version            | Provided by            |
|-------------|--------------------|------------------------|
| Python      | 3.14 (>= 3.11 ok)  | `apt` (`python3`)      |
| PostgreSQL  | 16+                | `apt` (`postgresql`)   |
| Redis       | 7+                 | `apt` (`redis-server`) |
| Node.js     | >= 18 (for Vite 5) | `apt` (`nodejs`)       |

---

## 2. One-command setup

From the project root (the folder containing `manage.py`):

```bash
bash scripts/setup_ubuntu.sh
```

This will:

1. `apt install` Python, PostgreSQL, Redis, Node and build tools.
2. Enable and start the **PostgreSQL** and **Redis** systemd services.
3. Create the database role + database described in `.env`
   (`updesk_user` / `updesk_db`) — idempotently.
4. Create a Python virtualenv at `./venv` and install `requirements.txt`.
5. Run database migrations.
6. Seed realistic **mock data** (`python manage.py seed_mock --fresh`).
7. `npm install` the frontend dependencies.

The script is safe to re-run.

> **Note on credentials:** the database name/user/password come from `.env`
> (`DB_NAME`, `DB_USER`, `DB_PASSWORD`). Change them there *before* running the
> script if you want different values — the script reads the same file the app
> does, so they always stay in sync.

---

## 3. Running the stack

Open four terminals (or use `tmux`). Each script activates the right venv/dir
for you:

```bash
bash scripts/run_backend.sh      # Django API   -> http://localhost:8000
bash scripts/run_worker.sh       # Celery worker (processes sync jobs)
bash scripts/run_beat.sh         # Celery beat   (schedules periodic syncs)
bash scripts/run_frontend.sh     # React app     -> http://localhost:3000
```

You don't strictly need the worker/beat to use the dashboard — they only run the
background Upwork sync jobs. But with `CELERY_EAGER=False` (the default in
`.env`), the **Sync Now** button queues a job that won't execute until a worker
is running.

### Useful URLs

| URL                                   | What                         |
|---------------------------------------|------------------------------|
| http://localhost:3000                 | React dashboard              |
| http://localhost:8000/api/v1/         | REST API root                |
| http://localhost:8000/api/docs/       | Swagger UI                   |
| http://localhost:8000/admin/          | Django admin                 |

### Demo login

```
username: demo
password: demo12345
```

(Also a Django superuser, so it works for `/admin/` too.)

---

## 4. How Celery works here

- Broker: **Redis** (`REDIS_URL` in `.env`, default `redis://127.0.0.1:6379/0`).
- Result backend: **django-db** (`django_celery_results`).
- Schedule: defined in [`apps/sync/schedule.py`](apps/sync/schedule.py) and run
  by `celery beat`.
- On Linux the worker uses Celery's default **prefork** pool — no `--pool=solo`
  (that flag is only needed on Windows).

Toggle in `.env`:

```ini
CELERY_EAGER=False   # tasks go through Redis + a worker (production-like)
CELERY_EAGER=True    # tasks run inline in the web process (no worker/Redis needed)
```

---

## 5. Configuration reference (`.env`)

```ini
DJANGO_SECRET_KEY=...
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=updesk_db
DB_USER=updesk_user
DB_PASSWORD=abcd1234
DB_HOST=localhost
DB_PORT=5432

REDIS_URL=redis://127.0.0.1:6379/0
CELERY_EAGER=False          # see section 4

JWT_ACCESS_MINUTES=60
JWT_REFRESH_DAYS=7
CORS_ALLOWED_ORIGINS=http://localhost:3000

# USE_SQLITE=True           # optional: run without PostgreSQL (dev only)
```

The frontend reads its API base URL from `updesk_frontend/.env`
(`VITE_API_URL=http://localhost:8000/api/v1`).

---

## 6. Common commands

```bash
# Re-seed mock data from scratch
./venv/bin/python manage.py seed_mock --fresh

# Make / apply migrations
./venv/bin/python manage.py makemigrations
./venv/bin/python manage.py migrate

# Create your own superuser
./venv/bin/python manage.py createsuperuser

# Build the frontend for production
cd updesk_frontend && npm run build
```

---

## 7. Troubleshooting

- **`psql: FATAL: role "updesk_user" does not exist`** — re-run
  `bash scripts/setup_ubuntu.sh`; the PostgreSQL step is idempotent.
- **Celery worker can't connect to Redis** — `sudo systemctl status redis-server`
  and `redis-cli ping` (expect `PONG`).
- **`django.db.utils.OperationalError: connection refused`** —
  `sudo systemctl status postgresql`.
- **Port already in use** — change the port in the matching `scripts/run_*.sh`.
- **Django 4.2 on Python 3.14** — Django 4.2 LTS predates Python 3.14, so it is
  not officially tested on it. It runs fine for this app (checks, migrations and
  all endpoints pass), but if you hit a deprecation/runtime error from Django
  internals, upgrading to Django 5.2 LTS is the clean fix.
