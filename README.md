# Credence

Credence is a scalable, event-driven backend application built with Node.js, TypeScript, and NestJS. It features secure transaction management, referral reward workflows, and credit ledger systems. This project is designed as a learning and production-ready project for backend development.

## Features

- REST APIs for signup, OTP, referral validation, transactions, and credits
- Referral reward workflows with job queues and retries
- Secure credit ledger system (issue, revoke, expire credits)
- Idempotency and concurrency safety to avoid duplicate rewards
- PostgreSQL integration with Prisma/TypeORM
- Redis / RabbitMQ / BullMQ for job queues and caching
- Unit and integration tests using Jest and Supertest
- Comprehensive API and DB documentation

## Tech Stack

- Node.js
- TypeScript
- NestJS
- PostgreSQL
- Redis / RabbitMQ / BullMQ
- Docker (for containerization)
- Jest / Supertest (testing)

## Getting Started

### Prerequisites

- Node.js LTS
- npm or yarn
- PostgreSQL
- Redis (optional, for caching and job queues)
- Docker (optional, for containerization)

### Installation

1. Clone the repository:
```bash
git clone git@github.com:MkdirRaiden/credence.git
cd credence
```
2. Install dependencies:
```bash
npm install
```
3. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your config
```
4. Run the application:
```bash
npm run start:dev
```

## Scripts

- `npm run start:dev` - Run the app in development mode
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run integration tests
- `npm run build` - Build the project for production
- `npm run start:prod` - Run the production build

## Contributing

This project is also a learning project. Contributions are welcome. Please follow SOLID principles and NestJS best practices.

## License

MIT License

