#!/bin/bash
# Usage: ./prisma.sh <command> <environment> [migration_name]
# Commands:
#   migrate  - apply migration (optionally create a new migration)
#   reset    - reset database and regenerate Prisma client
#   rebuild  - reset, apply all migrations, optionally create a new migration
# Example:
#   ./prisma.sh migrate development add_users_table
#   ./prisma.sh reset production
#   ./prisma.sh rebuild test initial_setup

set -e

COMMAND=$1
ENV=$2
MIGRATION_NAME=$3

if [ -z "$COMMAND" ] || [ -z "$ENV" ]; then
  echo "❌ Usage: $0 <command: migrate|reset|rebuild> <environment> [migration_name]"
  exit 1
fi

ENV_FILE="./env/.env.$ENV"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Environment file $ENV_FILE not found!"
  exit 1
fi

echo "🔄 Running Prisma command: $COMMAND for environment: $ENV"

# Load environment variables (includes DATABASE_URL & SHADOW_DATABASE_URL)
export $(grep -v '^#' "$ENV_FILE" | xargs)

case $COMMAND in
  migrate)
    if [ -z "$MIGRATION_NAME" ]; then
      npx prisma migrate dev --schema=prisma/schema.prisma
      echo "✅ Migration applied using existing migration name/folder."
    else
      npx prisma migrate dev --name "$MIGRATION_NAME" --schema=prisma/schema.prisma
      echo "✅ Migration applied. Folder: prisma/migrations/$MIGRATION_NAME"
    fi
    ;;
    
  reset)
    npx prisma migrate reset --force --schema=prisma/schema.prisma
    echo "✅ Database reset and Prisma Client regenerated for $ENV"
    ;;
    
  rebuild)
    npx prisma migrate reset --force --schema=prisma/schema.prisma
    npx prisma migrate dev --schema=prisma/schema.prisma
    if [ ! -z "$MIGRATION_NAME" ]; then
      npx prisma migrate dev --name "$MIGRATION_NAME" --schema=prisma/schema.prisma
      echo "🔄 New migration created: $MIGRATION_NAME"
    fi
    echo "✅ Database rebuilt and Prisma Client regenerated for $ENV"
    ;;
    
  *)
    echo "❌ Unknown command: $COMMAND"
    echo "Available commands: migrate, reset, rebuild"
    exit 1
    ;;
esac
