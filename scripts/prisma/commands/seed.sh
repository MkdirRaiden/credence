#!/usr/bin/env bash
# seed.sh — Seed Prisma database with initial data
# Usage: bash scripts/prisma/commands/seed.sh [environment]

set -euo pipefail

ENVIRONMENT="${1:-development}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ──────────────────────────────────────────────
# 1 Load bootstrap (paths + logging)
# ──────────────────────────────────────────────
source "$DIR/../../bootstrap.sh"

# ──────────────────────────────────────────────
# 2 Guard environment (env + validation + schema paths)
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/prisma-guard.sh" "$ENVIRONMENT"

# ──────────────────────────────────────────────
# 3 Ensure merged schema exists
# ──────────────────────────────────────────────
check_files "$SCHEMA_FILE"

# ──────────────────────────────────────────────
# 4 Prevent seeding in production (optional safeguard)
# ──────────────────────────────────────────────
if [[ "${NODE_ENV:-$ENVIRONMENT}" == "production" ]]; then
  log_warning "⚠️  Seeding in production - proceed with caution!"
  read -p "Are you sure you want to seed production database? (yes/no): " confirm
  if [[ "$confirm" != "yes" ]]; then
    log_error "❌ Production seeding cancelled"
    exit 1
  fi
fi

# ──────────────────────────────────────────────
# 5 Run seed script
# ──────────────────────────────────────────────
log_info "🌱 Seeding database for environment: $ENVIRONMENT"

if [[ -f "$REPO_ROOT/prisma/seed.ts" ]]; then
  npx ts-node "$REPO_ROOT/prisma/seed.ts"
elif command -v npx prisma &>/dev/null; then
  # Fallback to Prisma's seed hook
  npx prisma db seed --schema "$SCHEMA_FILE"
else
  log_error "❌ No seed script found at prisma/seed.ts"
  exit 1
fi

log_success "✅ Database seeded successfully for environment: $ENVIRONMENT"
