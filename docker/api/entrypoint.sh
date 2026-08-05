#!/bin/sh
# ─────────────────────────────────────────────
# API Entrypoint Script
# ─────────────────────────────────────────────
set -e

echo "🚀 Starting Service Marketplace API..."

# Wait for database
echo "⏳ Waiting for PostgreSQL..."
until pg_isready -h postgres -U "${POSTGRES_USER:-svcmarket}" -d "${POSTGRES_DB:-svcmarket}" > /dev/null 2>&1; do
    sleep 2
done
echo "✅ PostgreSQL ready"

# Wait for Redis
echo "⏳ Waiting for Redis..."
until redis-cli -h redis -a "${REDIS_PASSWORD}" ping > /dev/null 2>&1; do
    sleep 2
done
echo "✅ Redis ready"

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Sync catalog from Git if configured
if [ -n "${CATALOG_GIT_REPO}" ]; then
    echo "📦 Syncing catalog from Git..."
    /app/scripts/sync-catalog.sh
fi

# Start the application
echo "✨ Starting API server..."
exec "$@"