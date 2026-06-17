#!/usr/bin/env bash
set -o errexit
corepack enable
corepack prepare pnpm@9.15.0 --activate
pnpm install --frozen-lockfile || pnpm install
pnpm turbo build --filter=@dnzmedya/admin
