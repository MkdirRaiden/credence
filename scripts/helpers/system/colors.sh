#!/usr/bin/env bash
# colors.sh — ANSI color codes for pretty terminal output (idempotent, circular-safe)
set -euo pipefail

: "${COLORS_LOADED:=0}"
if (( COLORS_LOADED == 0 )); then
  COLORS_LOADED=1
  export COLORS_LOADED

  # ──────────────────────────────────────────────
  # Only define colors if terminal supports it
  # ──────────────────────────────────────────────
  if [[ -t 1 ]]; then
    RED="\033[31m"
    GREEN="\033[32m"
    YELLOW="\033[33m"
    BLUE="\033[34m"
    MAGENTA="\033[35m"
    CYAN="\033[36m"
    RESET="\033[0m"
    BOLD="\033[1m"
  else
    RED="" GREEN="" YELLOW="" BLUE="" MAGENTA="" CYAN="" RESET="" BOLD=""
  fi

  export RED GREEN YELLOW BLUE MAGENTA CYAN RESET BOLD

  # ──────────────────────────────────────────────
  # Helper functions
  # ──────────────────────────────────────────────
  color_red()     { echo -e "${RED}$*${RESET}"; }
  color_green()   { echo -e "${GREEN}$*${RESET}"; }
  color_yellow()  { echo -e "${YELLOW}$*${RESET}"; }
  color_blue()    { echo -e "${BLUE}$*${RESET}"; }
  color_magenta() { echo -e "${MAGENTA}$*${RESET}"; }
  color_cyan()    { echo -e "${CYAN}$*${RESET}"; }

  # Export functions for subshells
  for fn in color_red color_green color_yellow color_blue color_magenta color_cyan; do
    export -f "$fn"
  done
fi
