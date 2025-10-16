#!/usr/bin/env bash
# Usage: source scripts/helpers/env-load.sh <environment>
set -euo pipefail

ENVIRONMENT="${1:-}"

if [[ -z "$ENVIRONMENT" ]]; then
  echo "❌ ENVIRONMENT is required (development|test|production)"; return 1
fi
case "$ENVIRONMENT" in
  development|test|production) ;;
  *) echo "❌ Invalid ENVIRONMENT: $ENVIRONMENT"; return 1 ;;
esac

ENV_FILE="./env/.env.${ENVIRONMENT}"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Environment file $ENV_FILE not found!"; return 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

export ENVIRONMENT
export NODE_ENV="${NODE_ENV:-$ENVIRONMENT}"
