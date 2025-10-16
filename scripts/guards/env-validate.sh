#!/usr/bin/env bash
# Usage: source scripts/guards/env-validate.sh [mode]
# mode: "dev-migrate" enforces shadow DB; default enforces core DB only
set -euo pipefail

MODE="${1:-}"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "❌ DATABASE_URL is not set"; return 1
fi

if [[ "$MODE" == "dev-migrate" ]]; then
  if [[ -z "${SHADOW_DATABASE_URL:-}" ]]; then
    echo "❌ SHADOW_DATABASE_URL is required for prisma migrate dev"; return 1
  fi
  if [[ "${SHADOW_DATABASE_URL}" == "${DATABASE_URL}" ]]; then
    echo "❌ SHADOW_DATABASE_URL must differ from DATABASE_URL"; return 1
  fi
fi
echo "✅ Environment validation passed for mode: ${MODE:-core}"