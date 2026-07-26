#!/usr/bin/env bash
# env-validate.sh — Validate required environment variables (idempotent, circular-safe)

set -euo pipefail

# ──────────────────────────────────────────────
# Parse arguments
# ──────────────────────────────────────────────
ENVIRONMENT="${1:-development}"
shift || true  # remaining args are additional required vars
REQUIRED_VARS=("$@")

# ──────────────────────────────────────────────
# Base required vars
# ──────────────────────────────────────────────
BASE_REQUIRED_VARS=(DATABASE_URL)
if [[ "${MODE:-}" == "dev-migrate" ]] || [[ "${MODE:-}" == "deploy" ]]; then
  BASE_REQUIRED_VARS+=(SHADOW_DATABASE_URL)
fi

ALL_REQUIRED_VARS=("${BASE_REQUIRED_VARS[@]}" "${REQUIRED_VARS[@]}")

# ──────────────────────────────────────────────
# Check for missing environment variables (idempotent)
# ──────────────────────────────────────────────
: "${ENV_VALIDATED:=0}"
if (( ENV_VALIDATED == 0 )); then
  MISSING_VARS=()
  for var in "${ALL_REQUIRED_VARS[@]}"; do
    # Skip internal lowercase or underscore-prefixed vars
    if [[ "$var" =~ ^_ ]] || [[ "$var" =~ ^[a-z] ]]; then
      continue
    fi
    if [[ -z "${!var:-}" ]]; then
      MISSING_VARS+=("$var")
    fi
  done

  if (( ${#MISSING_VARS[@]} > 0 )); then
    log_error "❌ Missing required environment variables for '$ENVIRONMENT':"
    for v in "${MISSING_VARS[@]}"; do
      log_error "   - $v"
    done
    [[ "${BASH_SOURCE[0]}" == "${0}" ]] && exit 1 || return 1
  fi

  log_info "✅ Environment variables validated successfully for '$ENVIRONMENT'"
  ENV_VALIDATED=1
  export ENV_VALIDATED
else
  log_info "ℹ️ Environment already validated for '$ENVIRONMENT'"
fi