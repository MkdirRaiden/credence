# Credence

**A production-grade referral and credit management system** built to learn and demonstrate enterprise NestJS architecture. Think of it as the backend for reward programs, referral systems, or any platform where credits, transactions, and user incentives matter.

Built with clean architecture principles, this project shows how to structure a real-world backend that can scale from MVP to production.

## Why This Project?

Most tutorials show you *how to build features*. This project shows you *how to architect systems*. 

I built Credence to:
- Master NestJS beyond the basics (Repository pattern, custom decorators, functional mappers)
- Handle complex domains: referrals, credits, idempotency, soft deletes
- Prepare for multi-database architectures (PostgreSQL + MongoDB + Redis)
- Write maintainable, testable code that follows SOLID principles

## What's Inside

### Core Features
- **Users Module** - Registration, profile management, referral tracking with soft deletes
- **Credit Ledger** - Track credit issuance, revocation, expiration with full audit trail
- **Referral System** - Codes, redemptions, referrer/referee relationships
- **OTP Verification** - Email and SMS-based verification workflows (coming soon)
- **Idempotency** - Prevent duplicate operations across API calls and background jobs
- **Health Monitoring** - Liveness and readiness checks with scheduled probes

### Architecture Highlights

**Clean Layered Architecture:**
```
Controller → Service → Repository → Database
                ↓
              Mapper
        (DTO ↔ Entity transformations)
```

**What makes this different:**
- Repository pattern for database abstraction (ready for multi-DB)
- Functional mappers (no classes, just pure functions)
- Custom decorators (`@NotFound`) for clean error handling
- Soft deletes everywhere (GDPR-friendly, preserves referral chains)
- Proper DTO validation with whitelist mode (security first)
- Type-safe configuration with Joi validation
- Contextual logging throughout the application

**Health Checks:**
- Liveness endpoint (is the app running?)
- Readiness endpoint (are dependencies healthy?)
- Scheduled health monitoring with extensible probes
- Ready for MongoDB/Redis when added

## Tech Stack

**Core:**
- Node.js 20+ + TypeScript (strict mode enabled)
- NestJS 11 (modular, dependency injection)
- Prisma 6 (type-safe ORM with schema-first approach)
- PostgreSQL (primary database)

**Future Integration:**
- MongoDB (analytics, logs)
- Redis (caching, sessions, rate limiting)
- BullMQ (job queues for async tasks)

**Developer Experience:**
- Jest (unit + integration + e2e tests)
- ESLint + Prettier (consistent code style)
- Path aliases (`@/*` instead of `../../../`)
- Environment-based config (type-safe with Joi validation)
- Modular Prisma schema (split across multiple files)

## Project Structure

```
src/
├── config/              # Environment configuration (type-safe with Joi)
├── database/            # Prisma service, database module
├── logger/              # Contextual logging service
├── health/              # Health check endpoints + probes
│   ├── probes/          # Database health probes
│   └── helpers/         # Liveness/readiness utilities
├── common/              # Shared utilities
│   ├── decorators/      # Custom decorators (@NotFound)
│   ├── filters/         # Exception filters
│   ├── interceptors/    # Response transformation
│   └── constants/       # App-wide constants
└── features/
    └── users/           # Users module (full CRUD)
        ├── dtos/        # Request/response validation
        ├── repositories/ # Database access layer
        ├── mappers/     # Functional data transformations
        ├── users.service.ts
        ├── users.controller.ts
        └── users.module.ts

prisma/
├── base.prisma          # Generator & datasource configuration
├── enums/enums.prisma         # Shared enums across models
├── models/              # Individual model schemas
│   ├── user.prisma
│   ├── referral.prisma
│   ├── credit.prisma
│   └── idempotency.prisma
└── schema.prisma        # Auto-generated merged schema (don't edit!)

scripts/
└── prisma/
    └── commands/        # Prisma utility scripts

__tests__/
├── unit/                # Fast, isolated tests
├── integration/         # Real database tests
├── e2e/                 # Full HTTP endpoint tests
└── jest.setup.ts        # Global test configuration
```

## Getting Started

### Prerequisites
- Node.js 20.0.0 or higher
- npm 9.0.0 or higher
- PostgreSQL 14+
- Bash (for Prisma scripts)

### Quick Start

1. Clone the repository:
```
git clone git@github.com:MkdirRaiden/credence.git
cd credence
```

2. Install dependencies:
```
npm install
```

3. Setup environment variables:
```
cp .env.example .env
# Edit .env with your PostgreSQL credentials 
```

4. Run database migrations:
```
npm run prisma:gen development
npm run prisma:migrate
```

5. Start development server:
```
npm run start:dev
```

6. Test the API:
```
curl http://localhost:5000/health/live
```

## Available Scripts

**Development:**
- `npm run start:dev` - Hot-reload development server
- `npm run start:debug` - Debug mode with inspector
- `npm run build` - Build for production
- `npm run start:prod` - Run production build

**Code Quality:**
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier

**Database (Prisma):**
- `npm run prisma:gen` - Merge and generate Prisma client
- `npm run prisma:migrate` - Create and apply migrations
- `npm run prisma:fmt` - Format and validate schema
- `npm run prisma:studio` - Open Prisma Studio (DB GUI)
- `npm run prisma:deploy` - Deploy migrations (production)
- `npm run prisma:reset` - Reset database (dev only)
- `npm run prisma:rebuild` - Clean and regenerate everything

**Testing:**
- `npm run test` - Run all tests
- `npm run test:unit` - Unit tests only
- `npm run test:integration` - Integration tests (real DB)
- `npm run test:e2e` - End-to-end tests
- `npm run test:cov` - Test coverage report
- `npm run test:watch` - Watch mode
- `npm run test:debug` - Debug mode

## API Documentation

### Users Endpoints

**Create User:**
```
POST /api/v1/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "+1234567890",
  "referralCode": "FRIEND123"
}
```

**Get All Users:**
```
GET /api/v1/users?skip=0&take=10
```

**Get User by ID:**
```
GET /api/v1/users/id/{userId}
```

**Update User:**
```
PUT /api/v1/users/{userId}
Content-Type: application/json

{
  "name": "Jane Doe"
}
```

**Delete User:**
```
DELETE /api/v1/users/{userId}
```

### Health Endpoints

**Liveness:**
```
GET /health/live
```

**Readiness:**
```
GET /health/ready
```

## Architecture Decisions

**Why Repository Pattern?** Preparing for multi-database architecture. Services stay clean when adding MongoDB/Redis.

**Why Functional Mappers?** Cleaner, more testable, easier to compose than classes.

**Why Soft Deletes?** Preserve referral chains and data integrity while respecting privacy.

**Why Custom Decorators?** DRY principle - handle null checks in one place.

**Why Modular Prisma Schema?** Easier collaboration, cleaner git diffs, better organization.

## What's Next

- Authentication (JWT, OAuth2, refresh tokens)
- OTP verification (email/SMS)
- Credit management with ledger
- Referral workflows
- MongoDB for analytics
- Redis for caching
- Job queues with BullMQ
- Swagger documentation
- Docker setup

## Contributing

Contributions welcome! Follow the existing patterns (Repository + Mapper + Service), write tests, and submit a PR.

**Code Standards:**
- Follow SOLID principles
- Use functional programming where possible
- Write comprehensive tests
- Run `npm run lint` before committing

## What I Learned

- NestJS dependency injection changes how you architect apps
- Repository pattern makes testing and future migrations easier
- Functional mappers are cleaner than class-based transformers
- Soft deletes are essential for relational data
- ValidationPipe with whitelist stops mass assignment attacks
- Multi-database prep should start on day one
- Type-safe config catches environment issues early

## License

MIT License - use freely for learning or production projects.

## Author

**Ahmed**  
Email: 1996raiden27@gmail.com  
GitHub: [@MkdirRaiden](https://github.com/MkdirRaiden)

Built as a hands-on learning project to master enterprise NestJS patterns.

## Support

⭐ Star this repo if you learned something  
🐛 Report bugs via issues  
💡 Suggest features via discussions  
🤝 Contribute via pull requests  

**Happy coding!** 🚀