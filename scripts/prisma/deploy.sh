#!/usr/bin/env bash
# Usage: ./deploy.sh <environment>
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENVIRONMENT="${1:-}"

source "$DIR/env-load.sh" "$ENVIRONMENT"
"$DIR/format-validate-generate.sh" "$ENVIRONMENT"

run npx prisma migrate deploy --schema "$SCHEMA_DIR"
echo "✅ Prisma deploy completed successfully."
