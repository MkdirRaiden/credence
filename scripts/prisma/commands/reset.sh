#!/usr/bin/env bash
# reset.sh — Reset Prisma database safely
# Usage: bash scripts/prisma/commands/reset.sh [environment]

set -euo pipefail

ENVIRONMENT="${1:-development}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ──────────────────────────────────────────────
# 1️⃣ Load bootstrap (paths + logging)
# ──────────────────────────────────────────────
source "$DIR/../../bootstrap.sh"

# ──────────────────────────────────────────────
# 2️⃣ Guard environment (dev only + shadow DB + schema paths)
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/prisma-guard.sh" "$ENVIRONMENT" "dev-migrate"

# ──────────────────────────────────────────────
# 3️⃣ Merge schema & generate Prisma client
# ──────────────────────────────────────────────
bash "$REPO_ROOT/scripts/prisma/commands/merge-generate.sh" "$ENVIRONMENT"

# ──────────────────────────────────────────────
# 4️⃣ Ensure merged schema exists
# ──────────────────────────────────────────────
check_files "$SCHEMA_FILE"

# ──────────────────────────────────────────────
# 5️⃣ Prevent reset in production
# ──────────────────────────────────────────────
if [[ "${NODE_ENV:-$ENVIRONMENT}" == "production" ]]; then
  log_error "❌ Refusing to reset database in production"
  exit 2
fi

# ──────────────────────────────────────────────
# 6️⃣ Reset development database
# ──────────────────────────────────────────────
log_info "🧹 Resetting database for environment: $ENVIRONMENT"
npx prisma migrate reset --force --skip-generate --schema "$SCHEMA_FILE"

# ──────────────────────────────────────────────
# 7️⃣ Optional seeding
# ──────────────────────────────────────────────
if npx prisma -v >/dev/null 2>&1; then
  log_info "🌱 Running Prisma seed script..."
  npx prisma db seed --schema "$SCHEMA_FILE"
fi

log_success "✅ Prisma reset + seed completed successfully for environment: $ENVIRONMENT"
