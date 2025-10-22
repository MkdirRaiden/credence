#!/usr/bin/env bash
# deploy.sh — Deploy Prisma migrations safely
# Usage: bash scripts/prisma/commands/deploy.sh [environment]

set -euo pipefail

ENVIRONMENT="${1:-production}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ──────────────────────────────────────────────
# 1️⃣ Load bootstrap (paths + logging)
# ──────────────────────────────────────────────
source "$DIR/../../bootstrap.sh"

# ──────────────────────────────────────────────
# 2️⃣ Guard environment (env + validation + schema paths)
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/prisma-guard.sh" "$ENVIRONMENT" "deploy"

# ──────────────────────────────────────────────
# 3️⃣ Merge schema & generate Prisma client
# ──────────────────────────────────────────────
bash "$REPO_ROOT/scripts/prisma/commands/merge-generate.sh" "$ENVIRONMENT"

# ──────────────────────────────────────────────
# 4️⃣ Validate merged schema exists
# ──────────────────────────────────────────────
check_files "$SCHEMA_FILE"

# ──────────────────────────────────────────────
# 5️⃣ Deploy migrations
# ──────────────────────────────────────────────
log_info "ℹ️ Deploying migrations to '$ENVIRONMENT' database..."
run npx prisma migrate deploy --schema "$SCHEMA_FILE"

log_success "✅ Prisma deploy completed successfully for environment '$ENVIRONMENT'"
