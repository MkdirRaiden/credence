#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV="${1:-}"

# Only core: no DB validation needed
source "$DIR/../guards/prisma-guard.sh" "$ENV" "core"

run npx prisma format --schema "$SCHEMA_FILE"
run npx prisma validate --schema "$SCHEMA_FILE"
run npx prisma generate --schema "$SCHEMA_FILE"
echo "✅ Prisma format, validate, and generate completed."
