#!/usr/bin/env bash
# env-load.sh — Load environment variables safely (idempotent, circular-safe)

set -euo pipefail

# ──────────────────────────────────────────────
# Validate environment argument
# ──────────────────────────────────────────────
ENVIRONMENT="${1:-}"
if [[ -z "$ENVIRONMENT" ]]; then
  log_error "Usage: source env-load.sh <environment> (development|test|production)"
  [[ "${BASH_SOURCE[0]}" == "${0}" ]] && exit 1 || return 1
fi

case "$ENVIRONMENT" in
  development|test|production) ;;
  *)
    log_error "Invalid ENVIRONMENT: $ENVIRONMENT (expected development|test|production)"
    [[ "${BASH_SOURCE[0]}" == "${0}" ]] && exit 1 || return 1
    ;;
esac

# ──────────────────────────────────────────────
# Locate environment file
# ──────────────────────────────────────────────
ENV_FILE="$REPO_ROOT/env/.env.$ENVIRONMENT"

#check file
check_files "$ENV_FILE"

# ──────────────────────────────────────────────
# Load environment variables (idempotent)
# ──────────────────────────────────────────────
: "${ENV_LOADED:=0}"
if (( ENV_LOADED == 0 )); then
  set -a
  source "$ENV_FILE"
  set +a
  ENV_LOADED=1
  export ENV_LOADED
  log_info "✅ Loaded environment: $ENVIRONMENT ($ENV_FILE)"
else
  log_info "ℹ️ Environment already loaded: $ENVIRONMENT"
fi

# ──────────────────────────────────────────────
# Export key environment variables
# ──────────────────────────────────────────────
export ENVIRONMENT
export NODE_ENV="${NODE_ENV:-$ENVIRONMENT}"