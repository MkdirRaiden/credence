#!/bin/bash
# Usage: ./prisma-migrate.sh <migration_name_optional>

set -e

MIGRATION_NAME=$1
ENV_FILE="./env/.env.development"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Environment file $ENV_FILE not found!"
  exit 1
fi

echo "🔄 Running Prisma migration for environment: development"

# Load environment variables
export $(grep -v '^#' "$ENV_FILE" | xargs)

# Run migration
if [ -z "$MIGRATION_NAME" ]; then
  npx prisma migrate dev --schema=prisma/schema.prisma
else
  npx prisma migrate dev --name "$MIGRATION_NAME" --schema=prisma/schema.prisma
fi

echo "✅ Development migration applied and Prisma Client regenerated."
