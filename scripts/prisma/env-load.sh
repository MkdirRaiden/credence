#!/usr/bin/env bash
# Usage: source env-load.sh <environment>
set -euo pipefail

ENVIRONMENT="${1:-}"
SCHEMA_DIR="./prisma"
ENV_FILE="./env/.env.${ENVIRONMENT}"

if [[ -z "$ENVIRONMENT" ]]; then
  echo "❌ ENVIRONMENT is required (development|test|production)"; exit 1;
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Environment file $ENV_FILE not found!"; exit 1;
fi

# Export variables from env file
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "❌ DATABASE_URL is not set in $ENV_FILE"; exit 1;
fi

export SCHEMA_DIR

run() { echo "+ $*"; "$@"; }
