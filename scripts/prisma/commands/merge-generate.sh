#!/usr/bin/env bash
# merge-generate.sh — Merge Prisma schema parts and generate client
# Usage: bash scripts/prisma/commands/merge-generate.sh [environment]
set -euo pipefail

ENVIRONMENT="${1:-development}"

# ──────────────────────────────────────────────
# 1️⃣ Load bootstrap (loads core + logging)
# ──────────────────────────────────────────────
source "$(dirname "$0")/../../bootstrap.sh"

# ──────────────────────────────────────────────
# 2️⃣ Guard Prisma environment (env + validation + schema paths)
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/prisma-guard.sh" "$ENVIRONMENT"

# ──────────────────────────────────────────────
# 3️⃣ Load Prisma helpers
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/prisma-utils.sh"
source "$REPO_ROOT/scripts/prisma/utils/schema-merge.sh"

# ──────────────────────────────────────────────
# 4️⃣ Prepare schema merge list
# ──────────────────────────────────────────────
SCHEMA_SRC_DIR="$REPO_ROOT/prisma"

SCHEMA_FILES=(
  "$SCHEMA_SRC_DIR/base.prisma"
  "$SCHEMA_SRC_DIR/enums/enums.prisma"
)

# Add all model files dynamically
for f in "$SCHEMA_SRC_DIR/models/"*.prisma; do
  [[ -f "$f" ]] && SCHEMA_FILES+=("$f")
done

# Ensure base.prisma exists
check_files "$SCHEMA_SRC_DIR/base.prisma"

# ──────────────────────────────────────────────
# 5️⃣ Merge, format, validate, generate
# ──────────────────────────────────────────────
merge_prisma_files "$SCHEMA_FILE" "${SCHEMA_FILES[@]}"
format_and_validate "$SCHEMA_FILE"
generate_client "$SCHEMA_FILE"

log_success "✅ Prisma client generated successfully for environment '$ENVIRONMENT'"
