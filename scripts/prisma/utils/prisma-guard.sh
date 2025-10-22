#!/usr/bin/env bash
# prisma-guard.sh — Load and validate environment, ensure Prisma schema paths exist
# Circular-safe, bootstrap-aware, no folder creation (since /prisma already exists)

set -euo pipefail

: "${PRISMA_GUARD_LOADED:=0}"
if (( PRISMA_GUARD_LOADED == 0 )); then
  PRISMA_GUARD_LOADED=1
  export PRISMA_GUARD_LOADED

  # ──────────────────────────────────────────────
  # Environment setup
  # ──────────────────────────────────────────────
  ENVIRONMENT="${1:-development}"
  export ENVIRONMENT

  MODE="${MODE:-core}"  # internal label for guard context
  export MODE

  # ──────────────────────────────────────────────
  # Required environment variables
  # ──────────────────────────────────────────────
  REQUIRED_ENV_VARS=(DATABASE_URL)
  if [[ "$MODE" == "dev-migrate" ]] || [[ "$MODE" == "deploy" ]]; then
    REQUIRED_ENV_VARS+=(SHADOW_DATABASE_URL)
  fi

  # Load & validate environment (idempotent)
  source "$REPO_ROOT/scripts/env/env-load.sh" "$ENVIRONMENT"
  source "$REPO_ROOT/scripts/env/env-validate.sh" "$ENVIRONMENT" "${REQUIRED_ENV_VARS[@]}"

  # ──────────────────────────────────────────────
  # Prisma schema paths
  # ──────────────────────────────────────────────
  source "$REPO_ROOT/scripts/prisma/utils/schema-paths.sh"

  # Ensure schema file exists — if merge didn’t run yet, just note it
  if [[ ! -f "$SCHEMA_FILE" ]]; then
    log_warn "⚠️  Prisma schema file not found yet: $SCHEMA_FILE"
    log_warn "   It will be generated automatically during merge step."
  fi

  log_success "✅ Prisma guard ready for environment '$ENVIRONMENT' (mode='$MODE')"
fi
