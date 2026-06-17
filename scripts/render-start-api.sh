#!/usr/bin/env bash
set -o errexit
mkdir -p uploads
exec node apps/api/dist/main.js
