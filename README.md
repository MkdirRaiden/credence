# Credence

Professional, scalable NestJS & Prisma backend application for credit ledger and referral system.

Author: Ahmed 1996raiden27@gmail.com

## Features

- Modular NestJS architecture following SOLID and DRY principles.
- Secure authentication with JWT, refresh tokens, and RBAC.
- Comprehensive Prisma schema with strong database-level constraints.
- Custom CLI scripts for managing schema, migrations, seeding, and environment.
- Structured logging and health monitoring.

## Architecture Overview

Credence is built using a modular NestJS framework, emphasizing clean architecture and scalability. Key architectural principles include:

- **SOLID & DRY:** Code follows single responsibility and avoids duplication.
- **Modular Design:** Core infrastructure modules (Config, Common, Database, Logger, Bootstrap, Root) support feature modules (Users, Auth, Refresh Tokens).
- **Dependency Injection:** Used extensively for service decoupling and testing.
- **Robust Security:** Integrated JWT authentication, refresh token lifecycle, role-based access control, and data validation.

## Environment Configuration

The application uses environment variables for configuration, securely managed with validation on startup. Key variables include:

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret key for signing JWTs.
- `JWT_REFRESH_SECRET`: Secret key for refresh tokens.
- `NODE_ENV`: Application environment (development, test, production).

## Getting Started

### Prerequisites

- Node.js v20 or higher
- PostgreSQL database

### Installation

```bash
npm install
```

### Running

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

### Testing

Unit tests:

```bash
npm run test:unit
```

Integration tests:

```bash
npm run test:integration
```

E2E tests:

```bash
npm run test:e2e
```

## Project Structure

The backend consists of core infrastructure modules and feature modules:

| Module        | Description                         |
|---------------|-----------------------------------|
| Config        | Environment config and validation  |
| Common        | Utilities, guards, interceptors    |
| Database      | Prisma DB client and lifecycle     |
| Logger        | Structured logging services        |
| Bootstrap     | App startup, middlewares, shutdown |
| Root          | App root module                    |
| Users         | User management and profiles       |
| Auth          | Authentication flows and guards    |
| Refresh Tokens| Refresh token lifecycle handling   |

## Documentation

- [Schema Definition](SCHEMA.md): Prisma schema design and constraints.
- [CLI Scripts](SCRIPTS.md): Automation for migrations and environment setup.

## Contribution

Contributions are welcome! Please open issues for bugs or feature requests and submit pull requests.

## License

MIT

---
