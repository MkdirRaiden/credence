#!/bin/bash
# scripts/prisma-migrate.sh
# Usage: ./prisma-migrate.sh <environment>
# Example: ./prisma-migrate.sh development

ENV=${1:-development}                 # default to development
SUPERUSER_ENV="./env/.env.superuser"

if [ ! -f "$SUPERUSER_ENV" ]; then
  echo "❌ Superuser env file not found: $SUPERUSER_ENV"
  exit 1
fi

echo "🔄 Applying migrations for environment: $ENV using superuser credentials"

# Load superuser env
export $(grep -v '^#' $SUPERUSER_ENV | xargs)

# Run Prisma migrate
npx prisma migrate deploy --schema=prisma/schema.prisma

# Regenerate Prisma client
npx prisma generate --schema=prisma/schema.prisma

echo "✅ Migrations applied and Prisma Client regenerated."
