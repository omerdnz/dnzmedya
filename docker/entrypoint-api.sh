#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-file:/data/dev.db}"

echo "→ Veritabanı hazırlanıyor..."
cd /app/packages/database
npx prisma db push --skip-generate

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "→ Seed çalıştırılıyor..."
  npx tsx prisma/seed.ts
fi

echo "→ API başlatılıyor..."
cd /app
exec node dist/main.js
