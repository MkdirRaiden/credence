# Credence Scripts Documentation

Custom CLI automation for Prisma migrations, schema management, and environment handling.

## Structure

scripts/
├── bootstrap.sh              # Core initialization
├── env/env-load.sh          # Environment loader
├── helpers/                 # Utilities (colors, logging, debug, validation)
├── helpers/                  # Utilities (colors, logging, debug, validation)
└── prisma/
    ├── utils/               # Schema merge, DB helpers
    └── commands/            # User-facing commands

## Commands

### merge-generate.sh
Merge schema files and generate Prisma client
```bash
npm run prisma:gen <environment>
```
Merges base.prisma + enums/*.prisma + models/*.prisma → formats → validates → generates client

### migrate.sh
Run database migrations
```bash
npm run prisma:migrate <environment>
```

### deploy.sh
Production-safe migration deployment
```bash
npm run prisma:deploy
```
Requires confirmation, validates production environment

### rebuild.sh
Complete database rebuild (dev only)
```bash
npm run prisma:rebuild [environment] [--skip-seed]
```
⚠️ Destructive: Drop all → migrations → seeds

### reset.sh
Full database wipe (dev only)
```bash
npm run prisma:reset [environment]
```
⚠️ Nuclear option: Multiple confirmations required

### seed.sh
Run database seeders
```bash
npm run prisma:seed [environment]
```

### studio.sh
Launch Prisma Studio
```bash
npm run prisma:studio [environment]
```
Opens at http://localhost:5555

## See also

- For detailed Prisma schema structure and constraints, see [SCHEMA.md](SCHEMA.md).