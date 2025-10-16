#!/usr/bin/env bash
# Usage: source scripts/helpers/schema-paths.sh
set -euo pipefail

SCHEMA_DIR="./prisma"
SCHEMA_FILE="${SCHEMA_DIR%/}/schema.prisma"
if [[ ! -f "$SCHEMA_FILE" ]]; then
  echo "❌ Prisma schema not found at $SCHEMA_FILE"; return 1
fi

export SCHEMA_DIR
export SCHEMA_FILE

run() { echo "+ $*"; "$@"; }
