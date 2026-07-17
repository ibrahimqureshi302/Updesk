# UpDesk — Upwork Account Management Dashboard

UpDesk is a full-stack web application that pulls a freelancer's data from
Upwork (profile, clients, contracts, earnings, messages, proposals) into one
private dashboard. It is built as a **Django REST** backend and a **React**
frontend, with **PostgreSQL** for storage and **Celery + Redis** for background
data syncing.

---

## Table of Contents

1. [What the Project Does](#1-what-the-project-does)
2. [Architecture Overview](#2-architecture-overview)
3. [Tech Stack](#3-tech-stack)
4. [File / Folder Structure](#4-file--folder-structure)
5. [Data Model](#5-data-model)
6. [Authentication Model](#6-authentication-model)
7. [Complete API Reference](#7-complete-api-reference)
8. [Celery & Redis — What and Why](#8-celery--redis--what-and-why)
9. [Configuration (.env)](#9-configuration-env)
10. [How to Run the Project](#10-how-to-run-the-project)
11. [Mock Data](#11-mock-data)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. What the Project Does

A freelancer connects their Upwork account once. UpDesk then keeps a local,
read-mostly copy of their Upwork data and presents it as a dashboard:

- **Profile** — name, title, hourly rate, Job Success Score, total earnings,
  connects balance, skills.
- **Clients** — everyone who has hired the freelancer, with private notes.
- **Projects** — contracts (hourly / fixed) and their milestones.
- **Earnings** — hourly time logs, payment transactions, monthly summary chart.
- **Messages** — read-only conversation threads (reply via a link to Upwork).
- **Proposals** — the proposal pipeline with win-rate analytics.
- **Sync** — a health monitor showing when each data module last synced.

Because Upwork's API is rate-limited and slow, UpDesk does not call Upwork live
on every page load. Instead it **syncs in the background** on a schedule (and on
demand) and serves the dashboard instantly from its own database. That is the
job of Celery + Redis (see [section 8](#8-celery--redis--what-and-why)).

---

## 2. Architecture Overview

```
                          ┌────────────────────────┐
                          │   React + Vite (SPA)    │
                          │   http://localhost:3000 │
                          └───────────┬────────────┘
                                      │  JSON over HTTP (JWT in Authorization header)
                                      ▼
                          ┌────────────────────────┐
                          │   Django REST Framework │
                          │   http://localhost:8000 │
                          │   /api/v1/...           │
                          └─────┬──────────────┬────┘
                                │              │
                  reads/writes  │              │  enqueues sync jobs
                                ▼              ▼
                       ┌──────────────┐   ┌──────────────┐
                       │  PostgreSQL  │   │    Redis     │ ◄── message broker
                       │  (app data)  │   │  (broker)    │
                       └──────▲───────┘   └──────┬───────┘
                              │                  │ delivers jobs
                              │ writes results   ▼
                              │           ┌──────────────┐      calls
                              └───────────┤ Celery worker├────────────► Upwork API
                                          │  + beat      │
                                          └──────────────┘
```

- The **React SPA** never talks to Upwork or the database directly. It only
  calls the Django REST API.
- **Django** authenticates requests with JWT, serves dashboard data from
  PostgreSQL, and enqueues sync jobs onto Redis.
- The **Celery worker** runs those jobs (calling Upwork), and **Celery beat**
  schedules them periodically. Results are written back to PostgreSQL.

---

## 3. Tech Stack

| Layer            | Technology                                                        |
|------------------|-------------------------------------------------------------------|
| Frontend         | React 18, Vite 5, MUI (Material UI), React Query, axios, recharts  |
| Backend          | Django 4.2.13, Django REST Framework 3.15                          |
| Auth             | `djangorestframework-simplejwt` (JWT) + Upwork OAuth 2.0           |
| Database         | PostgreSQL (via `psycopg` 3)                                       |
| Background jobs  | Celery 5.3 + Redis 5                                               |
| Scheduling       | `django-celery-beat`                                               |
| Task results     | `django-celery-results` (`django-db` backend)                     |
| API docs         | `drf-spectacular` (Swagger UI / ReDoc / OpenAPI schema)           |
| Token encryption | `cryptography` (Fernet)                                            |
| Config           | `python-decouple` (reads `.env`)                                   |
| Filtering        | `django-filter`                                                   |

---

## 4. File / Folder Structure

```
updesk (2)/                       # project root (contains manage.py)
├── manage.py                     # Django CLI entry point
├── celery_app.py                 # Celery application entry point
├── requirements.txt              # Python dependencies
├── .env                          # Secrets & config (not committed)
│
├── config/                       # Project configuration package
│   ├── settings/
│   │   ├── base.py               # Shared settings (DB, DRF, JWT, Celery, Swagger)
│   │   └── development.py        # Dev overrides (DEBUG, SQLite toggle, eager Celery)
│   ├── urls.py                   # Root URL router (mounts every app under /api/v1/)
│   └── wsgi.py                   # WSGI entry point for production servers
│
├── apps/                         # All business logic, one Django app per domain
│   ├── authentication/           # Local register/login (JWT) + Upwork OAuth
│   ├── clients/                  # Upwork clients
│   ├── projects/                 # Contracts + milestones
│   ├── earnings/                 # Time logs, transactions, monthly summary
│   ├── messages/                 # Read-only message threads
│   ├── proposals/                # Proposal pipeline + win-rate stats
│   ├── profile/                  # Freelancer profile
│   └── sync/                     # Sync orchestration, Celery tasks, schedule, health
│
├── utils/                        # Cross-app helpers
│   ├── pagination.py             # StandardPagination (page size 20, max 100)
│   └── exceptions.py             # Uniform { success, error } error envelope
│
├── scripts/                      # Ubuntu setup + run helpers
│   ├── setup_ubuntu.sh           # One-command install (apt, DB, venv, migrate, seed)
│   ├── run_backend.sh            # Django dev server
│   ├── run_worker.sh             # Celery worker
│   ├── run_beat.sh               # Celery beat (scheduler)
│   └── run_frontend.sh           # React/Vite dev server
│
└── updesk_frontend/              # React + Vite single-page app
    ├── src/
    │   ├── api/                  # axios client + one module per API domain
    │   ├── pages/                # Dashboard pages
    │   ├── components/           # Reusable UI components
    │   ├── context/ hooks/       # Auth context, data hooks
    │   └── main.jsx App.jsx      # App bootstrap & routing
    ├── vite.config.js            # Dev server + proxy + build config
    └── package.json              # Frontend dependencies
```

### Anatomy of a Django app

Every app under `apps/` follows the same layout, which makes the codebase
predictable:

| File             | Responsibility                                                    |
|------------------|-------------------------------------------------------------------|
| `models.py`      | Database tables (one model per concept, scoped to a `User`)       |
| `serializers.py` | Convert models ↔ JSON; define request/response shapes             |
| `views.py`       | HTTP endpoints (class-based DRF views — Swagger reads them)        |
| `urls.py`        | Maps URL paths to views                                            |
| `services.py`    | Talks to Upwork's API; pure business logic, no HTTP layer         |
| `admin.py`       | Django admin registration                                         |
| `migrations/`    | Database schema history                                           |

The `sync` app additionally has `tasks.py` (Celery tasks), `schedule.py` (the
beat schedule), and `management/commands/seed_mock.py` (the mock-data seeder).

---

## 5. Data Model

All records belong to a Django `User` and carry a unique `upwork_id` (so syncs
are idempotent — re-syncing updates the existing row instead of duplicating it).

| Model               | Table                  | Key fields                                                                 |
|---------------------|------------------------|----------------------------------------------------------------------------|
| `UpworkToken`       | `upwork_tokens`        | encrypted access/refresh tokens, `expires_at`, `scope`                     |
| `Client`            | `clients`              | `name`, `company_name`, `country`, `total_hires`, private `notes`          |
| `Contract`          | `contracts`            | `title`, `status`, `contract_type` (HOURLY/FIXED), rate/price, dates       |
| `Milestone`         | `milestones`           | belongs to Contract; `amount`, `status` (PENDING…RELEASED), `due_date`     |
| `TimeLog`           | `time_logs`            | hourly diary: `date`, `hours`, `amount`, `memo`                            |
| `Transaction`       | `transactions`         | `date`, `ttype`, `description`, `amount`                                   |
| `MessageThread`     | `message_threads`      | one per contract; `last_preview`, `unread_count`                          |
| `Message`           | `messages`             | belongs to thread; `sender_name`, `body`, `sent_at`                        |
| `Proposal`          | `proposals`            | `job_title`, `status` (SUBMITTED…WON), `bid_amount`, `cover_letter`        |
| `FreelancerProfile` | `freelancer_profiles`  | `title`, `hourly_rate`, `job_success_score`, `total_earnings`, `skills`    |
| `SyncLog`           | `sync_logs`            | `module`, `status` (RUNNING/SUCCESS/ERROR), `records_synced`, timings      |

**Token encryption:** `UpworkToken` never stores raw OAuth tokens. They are
encrypted with Fernet (key derived from `SECRET_KEY`) via Python property
setters and decrypted transparently on read.

---

## 6. Authentication Model

There are **two distinct logins**, which is a common point of confusion:

1. **UpDesk dashboard login (JWT).** A local account (`username` + `password`)
   used to sign in to the dashboard. On register/login the API returns an
   `access` token (60 min) and a `refresh` token (7 days). The React app sends
   `Authorization: Bearer <access>` on every request and silently refreshes the
   access token when it expires.

2. **Upwork connection (OAuth 2.0).** Separately, the user connects their actual
   Upwork account. UpDesk gets an OAuth `code`, exchanges it for Upwork
   access/refresh tokens, and stores them encrypted. Those tokens are what the
   Celery sync jobs use to call Upwork.

All data endpoints require the JWT (`IsAuthenticated` is the global default);
only `register` and the Upwork `callback` are public.

---

## 7. Complete API Reference

**Base URL:** `http://localhost:8000/api/v1/`
**Auth:** send `Authorization: Bearer <access_token>` on every endpoint except
where noted as *Public*.
**Pagination:** list endpoints return `{ count, next, previous, results }`.
Control with `?page=<n>&page_size=<n>` (default 20, max 100).
**Errors:** returned as `{ "success": false, "error": { "status_code", "detail" } }`.

Interactive docs (auto-generated): **`/api/docs/`** (Swagger UI),
**`/api/redoc/`** (ReDoc), **`/api/schema/`** (raw OpenAPI).

### 7.1 Authentication — `/api/v1/auth/`

| Method | Path                  | Auth   | Description                                                            |
|--------|-----------------------|--------|-----------------------------------------------------------------------|
| POST   | `register/`           | Public | Create a dashboard account. Body: `{username, password}`. Returns `access`, `refresh`, `user`. |
| POST   | `token/`              | Public | Log in. Body: `{username, password}`. Returns `access`, `refresh`.    |
| POST   | `token/refresh/`      | Public | Exchange a refresh token for a new access token. Body: `{refresh}`.   |
| GET    | `upwork/login/`       | JWT    | Returns `{auth_url}` — open it to start the Upwork OAuth flow.        |
| GET    | `upwork/callback/`    | Public | OAuth redirect target. Exchanges `?code=` for Upwork tokens.         |
| GET    | `upwork/status/`      | JWT    | `{connected, expires_at, is_expired}` — is Upwork connected?         |

### 7.2 Profile — `/api/v1/profile/`

| Method | Path | Auth | Description                                                  |
|--------|------|------|--------------------------------------------------------------|
| GET    | `/`  | JWT  | The freelancer's profile. 404 with a hint if not synced yet. |

### 7.3 Clients — `/api/v1/clients/`

| Method | Path        | Auth | Description                                          |
|--------|-------------|------|------------------------------------------------------|
| GET    | `/`         | JWT  | List clients. Filter `?country=`; search `?search=` (name/company/email); order `?ordering=name|updated_at`. |
| GET    | `<id>/`     | JWT  | Retrieve one client.                                |
| PATCH/PUT | `<id>/`  | JWT  | Update the private `notes` field (the only writable field). |

### 7.4 Projects — `/api/v1/projects/`

| Method | Path           | Auth | Description                                                       |
|--------|----------------|------|------------------------------------------------------------------|
| GET    | `/`            | JWT  | List contracts (with nested milestones + `client_name`). Filter `?status=`, `?contract_type=`; search `?search=` (title); order `?ordering=start_date|updated_at`. |
| GET    | `<id>/`        | JWT  | Retrieve one contract.                                          |
| GET    | `milestones/`  | JWT  | All milestones across contracts. Filter `?status=`; order `?ordering=due_date|amount`. |

### 7.5 Earnings — `/api/v1/earnings/`

| Method | Path             | Auth | Description                                                                 |
|--------|------------------|------|-----------------------------------------------------------------------------|
| GET    | `timelogs/`      | JWT  | Hourly diary entries. Filter `?contract=<id>`; order `?ordering=date|hours`. |
| GET    | `transactions/`  | JWT  | Payment transactions. Filter `?ttype=`, date range `?from=YYYY-MM-DD&to=YYYY-MM-DD`; order `?ordering=date|amount`. |
| GET    | `summary/`       | JWT  | Monthly totals for a year (`?year=2025`). Returns `[{month, total}]` for the chart. |

### 7.6 Messages — `/api/v1/messages/` (read-only)

| Method | Path                      | Auth | Description                                          |
|--------|---------------------------|------|------------------------------------------------------|
| GET    | `/`                       | JWT  | List threads (with nested messages).                |
| GET    | `<id>/`                   | JWT  | Retrieve one thread with all messages.              |
| GET    | `<id>/open-in-upwork/`    | JWT  | Returns `{upwork_url}` to reply on Upwork directly. |

### 7.7 Proposals — `/api/v1/proposals/`

| Method | Path                      | Auth | Description                                                                  |
|--------|---------------------------|------|------------------------------------------------------------------------------|
| GET    | `/`                       | JWT  | List proposals. Filter `?status=`; search `?search=` (job title); order `?ordering=-submitted_at|bid_amount`. |
| GET    | `stats/`                  | JWT  | `{total, won, win_rate, by_status{}}` — pipeline analytics.                  |
| GET    | `<id>/`                   | JWT  | Retrieve one proposal (full cover letter).                                   |
| GET    | `<id>/open-in-upwork/`    | JWT  | Returns `{upwork_url}` to the original job posting.                          |

### 7.8 Sync — `/api/v1/sync/`

| Method | Path        | Auth | Description                                                              |
|--------|-------------|------|-------------------------------------------------------------------------|
| GET    | `status/`   | JWT  | Latest `SyncLog` per module (`profile, clients, …`) — powers the health monitor. |
| POST   | `trigger/`  | JWT  | "Sync Now" — enqueues a full background sync. Returns `202 Accepted`.    |
| GET    | `history/`  | JWT  | Last 50 sync log entries across all modules.                            |

---

## 8. Celery & Redis — What and Why

### The problem they solve

Upwork's API is **slow and rate-limited**. If the dashboard called Upwork live
on every page load, pages would take seconds, and Upwork would throttle us. We
also want data to stay fresh without the user clicking refresh.

The solution is to **decouple** fetching data from serving it:

- The web request returns instantly from PostgreSQL.
- A separate process fetches from Upwork **in the background**, on a schedule.

That separation needs two pieces: a task queue (Celery) and a message broker
(Redis).

### Redis — the message broker

**Redis** is an in-memory key-value store. Here it acts as the **broker**: a
fast queue that holds "jobs to be done." When Django wants a sync to happen, it
doesn't do the work — it drops a small message ("run sync.clients for user 2")
onto Redis and returns immediately. Redis is configured via `REDIS_URL`
(`redis://127.0.0.1:6379/0`) and set as `CELERY_BROKER_URL`.

### Celery — the task queue / worker

**Celery** is a distributed task system. It has two roles here:

- **Worker** (`celery -A celery_app worker`) — a long-running process that
  watches Redis, pulls jobs off the queue, and executes them (calling Upwork via
  the app's `services.py`, then writing results to PostgreSQL).
- **Beat** (`celery -A celery_app beat`) — a scheduler that puts jobs onto the
  queue on a timetable.

The tasks live in `apps/sync/tasks.py` (one per module: `sync.profile`,
`sync.clients`, `sync.projects`, `sync.earnings`, `sync.messages`,
`sync.proposals`, plus `sync.all`). Each task wraps its work in a `SyncLog` row
so the dashboard can show what ran, when, and whether it succeeded.

### The schedule

Defined in `apps/sync/schedule.py` and executed by beat:

| Job        | Frequency        |
|------------|------------------|
| profile    | every 6 hours    |
| clients    | every hour       |
| projects   | every hour       |
| earnings   | every 6 hours    |
| messages   | every 10 minutes |
| proposals  | every 30 minutes |

### Result backend

Task results are stored in PostgreSQL via `django-celery-results`
(`CELERY_RESULT_BACKEND = "django-db"`), so completed jobs are queryable from
Django.

### "Eager" mode (run without Redis)

For quick local testing you can skip Redis and the worker entirely by setting
`CELERY_EAGER=True`. Tasks then run **inline** inside the web process (slower for
the user, but zero infrastructure). With `CELERY_EAGER=False` (the production-
like default) the worker + Redis are required for sync jobs to actually run.

### Why this design (summary)

- **Fast responses** — the user never waits on Upwork.
- **Resilience** — if Upwork is down, jobs retry; the dashboard still loads.
- **Scheduling** — data refreshes automatically.
- **Scalability** — add more workers to process more jobs in parallel.

---

## 9. Configuration (.env)

```ini
DJANGO_SECRET_KEY=...                       # Django cryptographic key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Upwork OAuth (leave blank to run with mock data only)
# UPWORK_CLIENT_ID=
# UPWORK_CLIENT_SECRET=
# UPWORK_REDIRECT_URI=http://localhost:8000/api/v1/auth/upwork/callback/

# PostgreSQL
DB_NAME=updesk_db
DB_USER=updesk_user
DB_PASSWORD=abcd1234
DB_HOST=localhost
DB_PORT=5432

# Redis / Celery
REDIS_URL=redis://127.0.0.1:6379/0
CELERY_EAGER=False                          # True = run tasks inline, no worker/Redis needed

# JWT
JWT_ACCESS_MINUTES=60
JWT_REFRESH_DAYS=7

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# USE_SQLITE=True                           # optional: run without PostgreSQL (dev only)
```

The **frontend** reads its API base URL from `updesk_frontend/.env`:
`VITE_API_URL=http://localhost:8000/api/v1`.

---

## 10. How to Run the Project

### Prerequisites
- Python 3.11+ (the project also runs on Python 3.14)
- PostgreSQL 14+ and Redis 5+
- Node.js 18+ (for the frontend)

### Option A — Ubuntu (recommended path, scripted)

```bash
cd <project-root>            # the folder containing manage.py
bash scripts/setup_ubuntu.sh # installs deps, creates DB, venv, migrates, seeds, npm install
```

Then run each process (separate terminals):

```bash
bash scripts/run_backend.sh   # Django API  → http://localhost:8000
bash scripts/run_worker.sh    # Celery worker
bash scripts/run_beat.sh      # Celery beat (scheduled syncs)
bash scripts/run_frontend.sh  # React app   → http://localhost:3000
```

### Option B — Manual (any OS)

```bash
# 1. Backend deps
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 2. Make sure PostgreSQL + Redis are running and the DB/user in .env exist

# 3. Database
python manage.py migrate
python manage.py seed_mock --fresh   # load demo data

# 4. Run the backend
python manage.py runserver           # http://localhost:8000

# 5. (separate terminals) Celery — only needed for background syncs
celery -A celery_app worker -l info  # add --pool=solo on Windows
celery -A celery_app beat   -l info

# 6. Frontend
cd updesk_frontend
npm install
npm run dev                          # http://localhost:3000
```

### Key URLs

| URL                                | What            |
|------------------------------------|-----------------|
| http://localhost:3000              | React dashboard |
| http://localhost:8000/api/v1/      | REST API root   |
| http://localhost:8000/api/docs/    | Swagger UI      |
| http://localhost:8000/api/redoc/   | ReDoc           |
| http://localhost:8000/admin/       | Django admin    |

> **Windows note:** Celery's default pool doesn't work on Windows — add
> `--pool=solo` to the worker command. On Linux/Ubuntu use the default pool.

---

## 11. Mock Data

A management command seeds a complete, realistic dataset so you can explore the
dashboard without connecting a real Upwork account:

```bash
python manage.py seed_mock --fresh
```

It creates a demo dashboard account and data:

- **Login:** username `demo`, password `demo12345` (also a Django superuser).
- 1 freelancer profile, 3 clients, 3 contracts, 4 milestones, 8 time logs,
  4 transactions, 2 message threads (with messages), 6 proposals, 6 sync logs.

The command is idempotent (keyed on `upwork_id`); `--fresh` wipes the demo
user's existing data first.

---

## 12. Troubleshooting

| Symptom                                            | Fix                                                                 |
|----------------------------------------------------|---------------------------------------------------------------------|
| `connection refused` from Django                   | PostgreSQL isn't running, or DB/user in `.env` don't exist.         |
| Celery worker can't connect / "Sync Now" does nothing | Start Redis and a worker, or set `CELERY_EAGER=True` for inline runs. |
| `Profile not synced yet`                           | Run `python manage.py seed_mock --fresh` (or trigger a real sync).  |
| Frontend can't reach the API                       | Check `updesk_frontend/.env` `VITE_API_URL` and that CORS allows port 3000. |
| Celery errors on Windows                           | Add `--pool=solo` to the worker command.                            |
| 401 on every API call                              | Missing/expired JWT — log in again to get a fresh `access` token.   |

---

*Generated project documentation for UpDesk. For the auto-generated, always-up-to-date
API reference, run the server and open `/api/docs/`.*


// demo=username,,password=demo12345