#!/usr/bin/env bash
# rebuild.sh — Rebuild Prisma setup: merge, reset, migrate
# Usage: bash scripts/prisma/commands/rebuild.sh [environment] [migration_name]

set -euo pipefail

ENVIRONMENT="${1:-development}"
MIGRATION_NAME="${2:-}"

# ──────────────────────────────────────────────
# 1️⃣ Load bootstrap (paths + logging)
# ──────────────────────────────────────────────
source "$(dirname "$0")/../../bootstrap.sh"

# ──────────────────────────────────────────────
# 2️⃣ Guard environment (ensures DATABASE_URL, SHADOW_DATABASE_URL, schema paths)
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/prisma-guard.sh" "$ENVIRONMENT" "dev-migrate"

# ──────────────────────────────────────────────
# 3️⃣ Merge schema & generate Prisma client
# ──────────────────────────────────────────────
bash "$REPO_ROOT/scripts/prisma/commands/merge-generate.sh" "$ENVIRONMENT"

# Ensure merged schema exists
check_files "$SCHEMA_FILE"

# ──────────────────────────────────────────────
# 5️⃣ Handle production environment
# ──────────────────────────────────────────────
if [[ "${NODE_ENV:-$ENVIRONMENT}" == "production" ]]; then
  log_info "🌐 Production mode detected — running prisma migrate deploy"
  npx prisma migrate deploy --schema "$SCHEMA_FILE"
  log_success "✅ Prisma migrations deployed successfully."
  exit 0
fi

# ──────────────────────────────────────────────
# 6️⃣ Reset development database
# ──────────────────────────────────────────────
log_info "🧹 Resetting development database for environment: $ENVIRONMENT"
npx prisma migrate reset --force --skip-generate --schema "$SCHEMA_FILE"

# ──────────────────────────────────────────────
# 7️⃣ Run migrations (dev)
# ──────────────────────────────────────────────
if [[ -n "$MIGRATION_NAME" ]]; then
  log_info "🚀 Running prisma migrate dev with migration name: $MIGRATION_NAME"
  npx prisma migrate dev --name "$MIGRATION_NAME" --schema "$SCHEMA_FILE"
else
  log_info "🚀 Running prisma migrate dev (no name provided)"
  npx prisma migrate dev --schema "$SCHEMA_FILE"
fi

log_success "✅ Prisma rebuild complete for environment '$ENVIRONMENT'"
