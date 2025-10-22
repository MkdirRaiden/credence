#!/usr/bin/env bash
# debug.sh — development debug utilities (circular-safe, bootstrap-ready)
set -euo pipefail

: "${DEBUG_LOADED:=0}"
if (( DEBUG_LOADED == 0 )); then
  DEBUG_LOADED=1
  export DEBUG_LOADED

  # Default DEBUG flag
  DEBUG="${DEBUG:-false}"

  # ──────────────────────────────────────────────
  # Print debug message if DEBUG=true
  # ──────────────────────────────────────────────
  debug() {
    if [[ "$DEBUG" == "true" ]]; then
      echo "[DEBUG] $*"
    fi
  }

  # ──────────────────────────────────────────────
  # Print variable name + value
  # ──────────────────────────────────────────────
  debug_var() {
    if [[ "$DEBUG" == "true" ]]; then
      local var_name="$1"
      echo "[DEBUG] $var_name=${!var_name:-<unset>}"
    fi
  }

  # ──────────────────────────────────────────────
  # Export functions for subshells
  # ──────────────────────────────────────────────
  for fn in debug debug_var; do
    export -f "$fn"
  done
fi
