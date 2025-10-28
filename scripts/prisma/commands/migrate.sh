#!/usr/bin/env bash
# migrate.sh — Run Prisma dev migrations safely
# Usage: bash scripts/prisma/commands/migrate.sh [environment] [migration_name]

set -euo pipefail

ENVIRONMENT="${1:-development}"
MIGRATION_NAME="${2:-}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ──────────────────────────────────────────────
# 1 Load bootstrap (paths + logging)
# ──────────────────────────────────────────────
source "$DIR/../../bootstrap.sh"

# ──────────────────────────────────────────────
# 2 Guard environment (env + validation + schema paths)
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/prisma-guard.sh" "$ENVIRONMENT" "dev-migrate"

# ──────────────────────────────────────────────
# 3 Merge schema & generate Prisma client
# ──────────────────────────────────────────────
bash "$REPO_ROOT/scripts/prisma/commands/merge-generate.sh" "$ENVIRONMENT"

# ──────────────────────────────────────────────
# 4 Validate merged schema exists
# ──────────────────────────────────────────────
check_files "$SCHEMA_FILE"

# ──────────────────────────────────────────────
# 5 Prevent running in production
# ──────────────────────────────────────────────
if [[ "${NODE_ENV:-$ENVIRONMENT}" == "production" ]]; then
  log_error "❌ Refusing to run 'prisma migrate dev' in production. Use 'deploy' instead."
  exit 2
fi

# ──────────────────────────────────────────────
# 6 Run migration
# ──────────────────────────────────────────────
if [[ -n "$MIGRATION_NAME" ]]; then
  log_info "🛠 Running prisma migrate dev with migration name: $MIGRATION_NAME"
  npx prisma migrate dev --name "$MIGRATION_NAME" --schema "$SCHEMA_FILE"
else
  log_info "🛠 Running prisma migrate dev without migration name"
  npx prisma migrate dev --schema "$SCHEMA_FILE"
fi

log_success "✅ Prisma migrate completed successfully for environment '$ENVIRONMENT'"
