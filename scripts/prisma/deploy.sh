#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV="${1:-}"

# deploy: only core DB presence, no shadow
source "$DIR/../guards/prisma-guard.sh" "$ENV" "deploy"
"$DIR/format-validate-generate.sh" "$ENV"

run npx prisma migrate deploy --schema "$SCHEMA_FILE"
echo "✅ Prisma deploy completed."
