# Credence Scripts Documentation

Custom CLI automation for Prisma migrations, schema management, and environment handling.

## Quick Start

```bash
# Development
bash scripts/prisma/commands/merge-generate.sh development
bash scripts/prisma/commands/migrate.sh development
bash scripts/prisma/commands/studio.sh development

# Production
bash scripts/prisma/commands/deploy.sh production
```

## Structure

scripts/
├── bootstrap.sh              # Core initialization
├── env/env-load.sh          # Environment loader
<<<<<<< HEAD
├── helpers/                 # Utilities (colors, logging, debug, validation)
=======
├── helpers/                  # Utilities (colors, logging, debug, validation)
>>>>>>> develope
└── prisma/
    ├── utils/               # Schema merge, DB helpers
    └── commands/            # User-facing commands

## Commands

### merge-generate.sh
Merge schema files and generate Prisma client
```bash
bash scripts/prisma/commands/merge-generate.sh <environment>
```
Merges base.prisma + enums/*.prisma + models/*.prisma → formats → validates → generates client

### migrate.sh
Run database migrations
```bash
bash scripts/prisma/commands/migrate.sh <environment> [mode]
# Modes: dev-migrate (default), deploy, core
```

### deploy.sh
Production-safe migration deployment
```bash
bash scripts/prisma/commands/deploy.sh production
```
Requires confirmation, validates production environment

### rebuild.sh
Complete database rebuild (dev only)
```bash
bash scripts/prisma/commands/rebuild.sh [environment] [--skip-seed]
```
⚠️ Destructive: Drop all → migrations → seeds

### reset.sh
Full database wipe (dev only)
```bash
bash scripts/prisma/commands/reset.sh [environment]
```
⚠️ Nuclear option: Multiple confirmations required

### seed.sh
Run database seeders
```bash
bash scripts/prisma/commands/seed.sh [environment]
```

### studio.sh
Launch Prisma Studio
```bash
bash scripts/prisma/commands/studio.sh [environment]
```
<<<<<<< HEAD
Opens at http://localhost:5555

## See also

- For detailed Prisma schema structure and constraints, see [SCHEMA.md](SCHEMA.md).
=======
Opens at http://localhost:5555
>>>>>>> develope
