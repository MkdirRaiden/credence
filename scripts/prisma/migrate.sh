#!/usr/bin/env bash
# Usage: ./migrate.sh <environment> [migration_name]
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENVIRONMENT="${1:-}"; MIGRATION_NAME="${2:-}"

source "$DIR/env-load.sh" "$ENVIRONMENT"
"$DIR/format-validate-generate.sh" "$ENVIRONMENT"

if [[ "${NODE_ENV:-$ENVIRONMENT}" == "production" ]]; then
  echo "❌ Refusing to run 'migrate dev' in production"; exit 2;
fi

if [[ -n "$MIGRATION_NAME" ]]; then
  run npx prisma migrate dev --name "$MIGRATION_NAME" --schema "$SCHEMA_DIR"
else
  run npx prisma migrate dev --schema "$SCHEMA_DIR"
fi
echo "✅ Prisma migrate completed successfully."