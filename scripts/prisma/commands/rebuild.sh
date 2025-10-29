#!/usr/bin/env bash
# rebuild.sh — Rebuild Prisma setup: merge, reset, migrate (NO SEED)
# Usage: bash scripts/prisma/commands/rebuild.sh [environment] [migration_name]

set -euo pipefail

ENVIRONMENT="${1:-development}"
MIGRATION_NAME="${2:-}"

# ──────────────────────────────────────────────
# 1 Load bootstrap (paths + logging)
# ──────────────────────────────────────────────
source "$(dirname "$0")/../../bootstrap.sh"

# ──────────────────────────────────────────────
# 2 Guard environment (ensures DATABASE_URL, SHADOW_DATABASE_URL, schema paths)
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/prisma-guard.sh" "$ENVIRONMENT" "dev-migrate"

# ──────────────────────────────────────────────
# 3 Merge schema & generate Prisma client
# ──────────────────────────────────────────────
bash "$REPO_ROOT/scripts/prisma/commands/merge-generate.sh" "$ENVIRONMENT"

# Ensure merged schema exists
check_files "$SCHEMA_FILE"

# ──────────────────────────────────────────────
# 4 Handle production environment
# ──────────────────────────────────────────────
if [[ "${NODE_ENV:-$ENVIRONMENT}" == "production" ]]; then
  log_info "🌐 Production mode detected — running prisma migrate deploy"
  npx prisma migrate deploy --schema "$SCHEMA_FILE"
  log_success "✅ Prisma migrations deployed successfully."
  exit 0
fi

# ──────────────────────────────────────────────
# 5 Reset development database (NO SEED)
# ──────────────────────────────────────────────
log_info "🧹 Resetting development database for environment: $ENVIRONMENT (no seed)"
npx prisma migrate reset --force --skip-generate --skip-seed --schema "$SCHEMA_FILE"

# ──────────────────────────────────────────────
# 6 Run migrations (dev)
# ──────────────────────────────────────────────
if [[ -n "$MIGRATION_NAME" ]]; then
  log_info "🚀 Running prisma migrate dev with migration name: $MIGRATION_NAME"
  npx prisma migrate dev --name "$MIGRATION_NAME" --schema "$SCHEMA_FILE"
else
  log_info "🚀 Running prisma migrate dev (no name provided)"
  npx prisma migrate dev --schema "$SCHEMA_FILE"
fi

log_success "✅ Prisma rebuild complete for environment '$ENVIRONMENT' (clean database)"
log_info "💡 To seed data, run: npm run prisma:seed"
