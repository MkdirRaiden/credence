#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV="${1:-}"; NAME="${2:-}"

# dev-migrate: needs shadow DB checks
source "$DIR/../guards/prisma-guard.sh" "$ENV" "dev-migrate"
"$DIR/format-validate-generate.sh" "$ENV"

if [[ "$NODE_ENV" == "production" ]]; then
  echo "❌ Refusing to run 'prisma migrate dev' in production. Use deploy."; exit 2
fi

if [[ -n "$NAME" ]]; then
  run npx prisma migrate dev --name "$NAME" --schema "$SCHEMA_FILE"
else
  run npx prisma migrate dev --schema "$SCHEMA_FILE"
fi
echo "✅ Prisma migrate completed."
