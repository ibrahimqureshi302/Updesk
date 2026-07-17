#!/bin/sh
set -e

echo "⏳ Waiting for Postgres at ${DB_HOST:-db}:${DB_PORT:-5432}..."
python - <<'PY'
import os, time, socket
host = os.environ.get("DB_HOST", "db")
port = int(os.environ.get("DB_PORT", "5432"))
for _ in range(60):
    try:
        socket.create_connection((host, port), 2).close()
        break
    except OSError:
        time.sleep(1)
else:
    raise SystemExit("❌ Postgres not reachable")
print("✅ Postgres is up")
PY

echo "📦 Applying database migrations..."
python manage.py migrate --noinput

echo "🎨 Collecting static files..."
python manage.py collectstatic --noinput

echo "🌱 Seeding demo data (idempotent)..."
python manage.py seed_mock || echo "⚠️  seed_mock skipped/failed (continuing)"

echo "🚀 Starting backend: $*"
exec "$@"
