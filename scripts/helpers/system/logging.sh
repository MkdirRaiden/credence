#!/usr/bin/env bash
# logging.sh — standard logging functions (circular-safe, bootstrap-ready)
set -euo pipefail

: "${LOGGING_LOADED:=0}"
if (( LOGGING_LOADED == 0 )); then
  LOGGING_LOADED=1
  export LOGGING_LOADED

  # Load colors safely
  source "$(dirname "${BASH_SOURCE[0]}")/colors.sh"

  # ──────────────────────────────────────────────
  # Logging functions
  # ──────────────────────────────────────────────
  log_info()    { echo "$(color_cyan "[INFO]") $*"; }
  log_success() { echo "$(color_green "[SUCCESS]") $*"; }
  log_warn()    { echo "$(color_yellow "[WARN]") $*"; }
  log_error()   { echo "$(color_red "[ERROR]") $*"; }
  log_debug()   {
    if [[ "${DEBUG:-false}" == "true" ]]; then
      echo "$(color_cyan "[DEBUG]") $*"
    fi
  }

  # ──────────────────────────────────────────────
  # Export functions for subshells
  # ──────────────────────────────────────────────
  for fn in log_info log_success log_warn log_error log_debug; do
    export -f "$fn"
  done
fi
