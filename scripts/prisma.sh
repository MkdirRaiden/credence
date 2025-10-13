#!/usr/bin/env bash
# Usage: ./prisma.sh <migrate|deploy|reset|rebuild> <environment> [migration_name]
set -euo pipefail

COMMAND="${1:-}"
ENVIRONMENT="${2:-}"
MIGRATION_NAME="${3:-}"

if [[ -z "$COMMAND" || -z "$ENVIRONMENT" ]]; then
  echo "❌ Usage: $0 <migrate|deploy|reset|rebuild> <environment> [migration_name]"
  exit 1
fi

SCHEMA_DIR="./prisma" # point to folder (multi-file) or change to prisma/schema.prisma if single-file
ENV_FILE="./env/.env.${ENVIRONMENT}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Environment file $ENV_FILE not found!"
  exit 1
fi

# Robust dotenv loading
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "❌ DATABASE_URL is not set in $ENV_FILE"
  exit 1
fi

run() { echo "+ $*"; "$@"; }

format_validate_generate() {
  run npx prisma format --schema "$SCHEMA_DIR"
  run npx prisma validate --schema "$SCHEMA_DIR"
  run npx prisma generate --schema "$SCHEMA_DIR"
}

case "$COMMAND" in
  migrate)
    # Block dev migrations in prod
    if [[ "${NODE_ENV:-$ENVIRONMENT}" == "production" ]]; then
      echo "❌ Refusing to run 'migrate dev' in production"
      exit 2
    fi
    format_validate_generate
    if [[ -n "$MIGRATION_NAME" ]]; then
      run npx prisma migrate dev --name "$MIGRATION_NAME" --schema "$SCHEMA_DIR"
    else
      run npx prisma migrate dev --schema "$SCHEMA_DIR"
    fi
    ;;

  deploy)
    # Safe for CI/prod; applies existing migrations only
    format_validate_generate
    run npx prisma migrate deploy --schema "$SCHEMA_DIR"
    ;;

  reset)
    # Dangerous: forbid on prod
    if [[ "${NODE_ENV:-$ENVIRONMENT}" == "production" ]]; then
      echo "❌ Refusing to reset database in production"
      exit 2
    fi
    format_validate_generate
    run npx prisma migrate reset --force --skip-generate --schema "$SCHEMA_DIR"
    # Optional seed if configured in package.json prisma.seed
    if npx prisma -v >/dev/null 2>&1; then
      run npx prisma db seed
    fi
    ;;

  rebuild)
    # Rebuild: reset then deploy existing migrations; optionally create a new one (dev only)
    if [[ "${NODE_ENV:-$ENVIRONMENT}" == "production" ]]; then
      echo "ℹ️ Production rebuild: reset is blocked. Running deploy only."
      format_validate_generate
      run npx prisma migrate deploy --schema "$SCHEMA_DIR"
      exit 0
    fi
    format_validate_generate
    run npx prisma migrate reset --force --skip-generate --schema "$SCHEMA_DIR"
    if [[ -n "$MIGRATION_NAME" ]]; then
      # create new migration on dev
      run npx prisma migrate dev --name "$MIGRATION_NAME" --schema "$SCHEMA_DIR"
    else
      # or just apply existing ones
      run npx prisma migrate dev --schema "$SCHEMA_DIR"
    fi
    ;;

  *)
    echo "❌ Unknown command: $COMMAND"
    echo "Available commands: migrate, deploy, reset, rebuild"
    exit 1
    ;;
esac

echo "✅ Done: $COMMAND for $ENVIRONMENT"
