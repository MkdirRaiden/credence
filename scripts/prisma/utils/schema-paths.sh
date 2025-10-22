#!/usr/bin/env bash
# schema-paths.sh — Define and export Prisma schema paths safely
# Depends on core.sh (helpers, logging), circular-safe

set -euo pipefail

: "${SCHEMA_PATHS_LOADED:=0}"
if (( SCHEMA_PATHS_LOADED == 0 )); then
  SCHEMA_PATHS_LOADED=1
  export SCHEMA_PATHS_LOADED

  # ──────────────────────────────────────────────
  # Define Prisma paths
  # Directly point to prisma/schema.prisma (no .generated folder)
  # ──────────────────────────────────────────────
  PRISMA_ROOT="$REPO_ROOT/prisma"
  SCHEMA_FILE="$PRISMA_ROOT/schema.prisma"
  SEED_FILE="$PRISMA_ROOT/seed.ts"

  # ──────────────────────────────────────────────
  # Inform if schema file does not exist yet
  # ──────────────────────────────────────────────
  if [[ ! -f "$SCHEMA_FILE" ]]; then
    log_info "Schema file will be generated automatically: $SCHEMA_FILE"
  fi

  # ──────────────────────────────────────────────
  # Export Prisma paths
  # ──────────────────────────────────────────────
  export PRISMA_ROOT SCHEMA_FILE SEED_FILE

  # ──────────────────────────────────────────────
  # Safe runner for Prisma commands
  # Always points to the correct schema file
  # ──────────────────────────────────────────────
  run_prisma() {
    log_info "▶️ Running Prisma command: $*"
    npx prisma "$@" --schema="$SCHEMA_FILE"
  }
  export -f run_prisma
fi