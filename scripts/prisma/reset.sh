#!/usr/bin/env bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV="${1:-}"

source "$DIR/../guards/prisma-guard.sh" "$ENV" "dev-migrate"
"$DIR/format-validate-generate.sh" "$ENV"

if [[ "$NODE_ENV" == "production" ]]; then
  echo "❌ Refusing to reset database in production"; exit 2
fi

run npx prisma migrate reset --force --skip-generate --schema "$SCHEMA_FILE"
if npx prisma -v >/dev/null 2>&1; then
  run npx prisma db seed --schema "$SCHEMA_FILE"
fi
echo "✅ Prisma reset completed."
