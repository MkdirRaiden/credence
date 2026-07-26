# Credence Scripts Documentation

Custom CLI automation for Prisma migrations, schema management, and environment handling.

## Structure

```
scripts/
├── bootstrap.sh              # Core initialization
├── var/env-load.sh          # Environment loader
├── helpers/                 # Utilities (colors, logging, debug validation)             
└── prisma/
    ├── utils/               # Schema merge, DB helpers
    └── commands/            # User-facing commands
```

## Commands

### merge-generate.sh
Merge schema files and generate Prisma client
```bash
pnpm run prisma:gen <environment>
```
Merges base.prisma + enums/*.prisma + models/*.prisma → formats → validates → generates client

### migrate.sh
Run database migrations
```bash
pnpm run prisma:migrate <environment>
```

### deploy.sh
Production-safe migration deployment
```bash
pnpm run prisma:deploy
```
Requires confirmation, validates production environment

### rebuild.sh
Complete database rebuild (dev only)
```bash
pnpm run prisma:rebuild [environment] [--skip-seed]
```
⚠️ Destructive: Drop all → migrations → seeds

### reset.sh
Full database wipe (dev only)
```bash
pnpm run prisma:reset [environment]
```
⚠️ Nuclear option: Multiple confirmations required

### seed.sh
Run database seeders
```bash
pnpm run prisma:seed [environment]
```

### studio.sh
Launch Prisma Studio
```bash
pnpm run prisma:studio [environment]
```
Opens at http://localhost:5555

## See also

- For detailed Prisma schema structure and constraints, see [SCHEMA.md](SCHEMA.md).