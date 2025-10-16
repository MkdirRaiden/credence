#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="${1:-}"
MODE="${2:-core}"

# Resolve this file's directory robustly
GUARD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HELPERS_DIR="${GUARD_DIR}/../helpers"

# Load environment and schema paths from helpers
# shellcheck disable=SC1090
source "${HELPERS_DIR}/env-load.sh" "$ENVIRONMENT"
# shellcheck disable=SC1090
source "${HELPERS_DIR}/schema-paths.sh"

case "$MODE" in
  core) ;;
  dev-migrate)
    # shellcheck disable=SC1090
    source "${GUARD_DIR}/env-validate.sh" "dev-migrate"
    ;;
  deploy)
    # shellcheck disable=SC1090
    source "${GUARD_DIR}/env-validate.sh"
    ;;
  *)
    echo "❌ Unknown guard mode: $MODE"; return 1 ;;
esac
