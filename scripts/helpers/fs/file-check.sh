#!/usr/bin/env bash
# file-check.sh — Validate required files exist (idempotent, circular-safe)
# Generic helper; does NOT load bootstrap or core

set -euo pipefail

# ──────────────────────────────────────────────
# Guard to prevent redeclaration
# ──────────────────────────────────────────────
: "${FILE_CHECK_LOADED:=0}"
if (( FILE_CHECK_LOADED == 0 )); then
  FILE_CHECK_LOADED=1
  export FILE_CHECK_LOADED

  # ──────────────────────────────────────────────
  # Function: check_files
  # Accepts a list of file paths, exits or returns on missing
  # ──────────────────────────────────────────────
  check_files() {
    local missing=()
    for f in "$@"; do
      if [[ ! -f "$f" ]]; then
        missing+=("$f")
      fi
    done

    if (( ${#missing[@]} > 0 )); then
      if declare -F log_error >/dev/null 2>&1; then
        log_error "❌ Missing required file(s):"
        for f in "${missing[@]}"; do
          log_error "   - $f"
        done
      else
        echo "❌ Missing required file(s):"
        for f in "${missing[@]}"; do
          echo "   - $f"
        done
      fi
      [[ "${BASH_SOURCE[0]}" == "${0}" ]] && exit 1 || return 1
    fi

    if declare -F log_info >/dev/null 2>&1; then
      log_info "✅ All required files are present"
    fi
  }

  # ──────────────────────────────────────────────
  # Export function for subshells
  # ──────────────────────────────────────────────
  export -f check_files
fi
