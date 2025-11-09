# SCHEMA.md

## Overview

This document summarizes the Prisma schema definition and database-level constraints for the Credence backend.

## Directory Structure

```
prisma/
├── base.prisma          # Base schema setup, generator, and datasource
├── enums/               # Enum types used across models
│   └── enums.prisma
├── models/              # Main database models split by domain
│   ├── user.prisma
│   ├── credit.prisma
│   ├── referral.prisma
│   ├── otp.prisma
│   └── others.prisma
└── schema.prisma        # Generated merged schema (via CLI)
```

## Prisma Schema Merging

The Prisma schema files are modularized into base, enums, and models directories for maintainability.

The custom CLI script `merge-generate.sh` is used to merge these schema files as part of the build and migration process. This script:

- Concatenates schema files to produce `schema.prisma`
- Formats and validates the schema
- Runs Prisma client generation

This modular approach supports flexible development and schema management.

## Manual Database-Level Constraints

Certain constraints and business validations are enforced manually at the database level (beyond Prisma schema capabilities) via SQL migrations:

- User table:
  - Prevents user self-referral
  - Password hash consistency based on auth provider
- OTP:
  - Limits on attempt counts
  - Indexes for pending OTPs
- Referral codes & redemptions:
  - Enforces redeemable time windows
  - Redemption state validations
- Credit ledgers:
  - Enforces sign on credit amounts
  - Validates source ledger references
- Idempotency records:
  - Manages state transitions and timestamps
  - Validates response hash state

These critical manual constraints increase data integrity and system security.

---

*Document created by AI assistant*