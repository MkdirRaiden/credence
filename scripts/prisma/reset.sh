#!/usr/bin/env bash
# Usage: ./reset.sh <environment>
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENVIRONMENT="${1:-}"

source "$DIR/env-load.sh" "$ENVIRONMENT"
"$DIR/format-validate-generate.sh" "$ENVIRONMENT"

if [[ "${NODE_ENV:-$ENVIRONMENT}" == "production" ]]; then
  echo "❌ Refusing to reset database in production"; exit 2;
fi

run npx prisma migrate reset --force --skip-generate --schema "$SCHEMA_DIR"

# Optional seed if configured
if npx prisma -v >/dev/null 2>&1; then
  run npx prisma db seed
fi
echo "✅ Prisma reset completed successfully."