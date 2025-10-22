#!/usr/bin/env bash
# scripts/prisma/commands/studio.sh
# Usage: bash studio.sh [environment]

set -euo pipefail

ENVIRONMENT="${1:-development}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ──────────────────────────────────────────────
# 1️⃣ Load bootstrap (paths + logging)
# ──────────────────────────────────────────────
source "$DIR/../../bootstrap.sh"

# ──────────────────────────────────────────────
# 2️⃣ Load environment safely
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/env/env-load.sh" "$ENVIRONMENT"

# ──────────────────────────────────────────────
# 3️⃣ Load Prisma schema paths
# ──────────────────────────────────────────────
source "$REPO_ROOT/scripts/prisma/utils/schema-paths.sh"

# ──────────────────────────────────────────────
# 4️⃣ Launch Prisma Studio
# ──────────────────────────────────────────────
log_info "ℹ️ Launching Prisma Studio for environment '$ENVIRONMENT'..."
run npx prisma studio --schema "$SCHEMA_FILE"
