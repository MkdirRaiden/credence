#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV="${1:-}"; NAME="${2:-}"

source "$DIR/../guards/prisma-guard.sh" "$ENV" "dev-migrate"
"$DIR/format-validate-generate.sh" "$ENV"

if [[ "$NODE_ENV" == "production" ]]; then
  echo "ℹ️ Production rebuild: deploy only."
  run npx prisma migrate deploy --schema "$SCHEMA_FILE"
  exit 0
fi

run npx prisma migrate reset --force --skip-generate --schema "$SCHEMA_FILE"
if [[ -n "$NAME" ]]; then
  run npx prisma migrate dev --name "$NAME" --schema "$SCHEMA_FILE"
else
  run npx prisma migrate dev --schema "$SCHEMA_FILE"
fi
echo "✅ Rebuild completed for: $ENV"
