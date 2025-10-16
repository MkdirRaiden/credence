#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV="${1:-}"

# Load environment (optional but harmless; enables consistent NODE_ENV if needed)
# shellcheck disable=SC1090
source "$DIR/../helpers/env-load.sh" "$ENV"

# Only need schema paths for these operations
source "$DIR/../helpers/schema-paths.sh"

run npx prisma format --schema "$SCHEMA_FILE"
run npx prisma validate --schema "$SCHEMA_FILE"
run npx prisma generate --schema "$SCHEMA_FILE"
echo "✅ Prisma format, validate, and generate completed."
