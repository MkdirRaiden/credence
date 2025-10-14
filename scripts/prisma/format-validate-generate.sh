#!/usr/bin/env bash
# Usage: ./format-validate-generate.sh <environment>
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$DIR/env-load.sh" "${1:-}"

run npx prisma format --schema "$SCHEMA_DIR"
run npx prisma validate --schema "$SCHEMA_DIR"
run npx prisma generate --schema "$SCHEMA_DIR"
echo "✅ Prisma format, validate, and generate completed successfully."
