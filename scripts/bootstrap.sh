#!/usr/bin/env bash
# bootstrap.sh — Unified loader for repo, helpers, and core utilities.
# Provides REPO_ROOT, HELPERS_ROOT, logging, file-check, debug, and safe runner.

set -euo pipefail

: "${BOOTSTRAP_LOADED:=0}"
if (( BOOTSTRAP_LOADED == 1 )); then
  return 0 2>/dev/null || exit 0
fi
BOOTSTRAP_LOADED=1
export BOOTSTRAP_LOADED

# ──────────────────────────────────────────────
# Resolve paths
# ──────────────────────────────────────────────
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HELPERS_ROOT="$REPO_ROOT/scripts/helpers"
export REPO_ROOT HELPERS_ROOT

# ──────────────────────────────────────────────
# Load helper modules
# ──────────────────────────────────────────────
source "${HELPERS_ROOT}/system/colors.sh"
source "${HELPERS_ROOT}/system/logging.sh"
source "${HELPERS_ROOT}/system/debug.sh"
source "${HELPERS_ROOT}/fs/file-check.sh"

# ──────────────────────────────────────────────
# Export functions for subshells
# ──────────────────────────────────────────────
for func in log_info log_warn log_error log_success log_debug check_files; do
  if declare -F "$func" >/dev/null 2>&1; then
    export -f "$func"
  fi
done

export color_cyan color_green color_red color_yellow color_reset

# ──────────────────────────────────────────────
# Safe runner utility
# ──────────────────────────────────────────────
run() {
  log_info "▶️  Running: $*"
  "$@"
}
export -f run

log_info "✅ Bootstrap loaded successfully from: ${HELPERS_ROOT}"
