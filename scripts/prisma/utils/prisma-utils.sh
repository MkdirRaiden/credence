#!/usr/bin/env bash
# prisma-utils.sh — Prisma utility functions: format/validate schema & generate client
# format_and_validate(): environment-independent
# generate_client(): environment-aware

set -euo pipefail

: "${PRISMA_UTILS_LOADED:=0}"
if (( PRISMA_UTILS_LOADED == 0 )); then
  PRISMA_UTILS_LOADED=1
  export PRISMA_UTILS_LOADED

  # ──────────────────────────────────────────────
  # Load Prisma schema paths
  # ──────────────────────────────────────────────
  if [[ -z "${SCHEMA_FILE:-}" ]]; then
    source "$REPO_ROOT/scripts/prisma/utils/schema-paths.sh"
  fi

  # ──────────────────────────────────────────────
  # Check Prisma CLI availability
  # ──────────────────────────────────────────────
  if ! command -v npx >/dev/null 2>&1; then
    log_error "❌ npx not found — please install Node.js/npm."
    exit 1
  fi

  # ──────────────────────────────────────────────
  # Format & validate schema (does NOT depend on environment)
  # ──────────────────────────────────────────────
  format_and_validate() {
    local schema="${1:-$SCHEMA_FILE}"

    if [[ ! -f "$schema" ]]; then
      log_error "❌ Prisma schema not found at: $schema"
      return 1
    fi

    log_info "▶️ Formatting Prisma schema: $schema"
    npx prisma format --schema "$schema"

    log_info "🧩 Validating Prisma schema: $schema"
    npx prisma validate --schema "$schema"

    log_success "✅ Prisma schema formatted and validated successfully."
  }

  # ──────────────────────────────────────────────
  # Generate Prisma client (requires ENV to be loaded)
  # ──────────────────────────────────────────────
  generate_client() {
    local schema="${1:-$SCHEMA_FILE}"

    if [[ ! -f "$schema" ]]; then
      log_error "❌ Prisma schema not found at: $schema"
      return 1
    fi

    if [[ -z "${ENVIRONMENT:-}" ]]; then
      log_warn "⚠️ ENVIRONMENT not set — using default .env for client generation"
    fi

    log_info "▶️ Generating Prisma client from schema: $schema"
    npx prisma generate --schema "$schema"

    log_success "✅ Prisma client generated successfully for environment '${ENVIRONMENT:-unknown}'."
  }

  # ──────────────────────────────────────────────
  # Export functions for subshells
  # ──────────────────────────────────────────────
  export -f format_and_validate generate_client
fi
