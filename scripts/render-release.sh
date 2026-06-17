#!/usr/bin/env bash
set -o errexit
corepack enable
corepack prepare pnpm@9.15.0 --activate
cd packages/database
npx prisma db push --skip-generate
if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "→ Seed çalıştırılıyor (RUN_SEED=true)..."
  npx tsx prisma/seed.ts
fi
