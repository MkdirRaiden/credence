#!/usr/bin/env bash
# format-validate.sh — Format and validate prisma/schema.prisma
# Usage: bash scripts/prisma/commands/format-validate.sh [environment]
set -euo pipefail

ENVIRONMENT="${1:-development}"

# ──────────────────────────────────────────────
# 1️⃣ Load bootstrap (paths + logging)
# ──────────────────────────────────────────────
source "$(dirname "$0")/../../bootstrap.sh"

# ──────────────────────────────────────────────
# 2️⃣ Guard Prisma environment (env + validation + schema paths)
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/prisma-guard.sh" "$ENVIRONMENT"

# ──────────────────────────────────────────────
# 3️⃣ Load Prisma utilities
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/prisma-utils.sh"

# ──────────────────────────────────────────────
# 4️⃣ Ensure merged schema exists at prisma/schema.prisma
# ──────────────────────────────────────────────
if [[ ! -f "$SCHEMA_FILE" ]]; then
  log_error "❌ Prisma schema not found at: $SCHEMA_FILE"
  log_info "💡 If you haven't yet, run: npm run prisma:merge (merge + generate)"
  exit 1
fi

# ──────────────────────────────────────────────
# 5️⃣ Format and validate
# ──────────────────────────────────────────────
log_info "🧹 Formatting and validating Prisma schema: $SCHEMA_FILE"
format_and_validate "$SCHEMA_FILE"

log_success "✅ Prisma schema formatted & validated for environment '$ENVIRONMENT'"
