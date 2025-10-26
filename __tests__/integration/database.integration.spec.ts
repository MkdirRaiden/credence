// __tests__/integration/database.integration.spec.ts
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '@/database/database.module';
import { ConfigModule } from '@/config/config.module';
import { DatabasePrismaService } from '@/database/database-prisma.service';

jest.setTimeout(20000); // Ensure enough time for DB retries

describe('DatabasePrismaService (Integration)', () => {
  let db: DatabasePrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, DatabaseModule],
    }).compile();

    db = moduleRef.get(DatabasePrismaService);

    // Ensure connection is established
    await db.onModuleInit?.();
  });

  afterAll(async () => {
    if (db?.onApplicationShutdown) {
      await db.onApplicationShutdown();
    }
  });

  it('runs SELECT 1', async () => {
    const res = await db.$queryRaw<any>`SELECT 1`;
    expect(res).toBeDefined();
  });

  it('creates, inserts, and queries a temp table inside a transaction', async () => {
    await db.$transaction(async (prisma) => {
      // Create temp table
      await prisma.$executeRaw`CREATE TEMP TABLE IF NOT EXISTS integration_test (id SERIAL PRIMARY KEY, name TEXT)`;

      // Insert a test row
      await prisma.$executeRaw`INSERT INTO integration_test (name) VALUES ('credence_test')`;

      // Query
      const rows = await prisma.$queryRaw<{ id: number; name: string }[]>`
        SELECT * FROM integration_test WHERE name='credence_test'
      `;
      expect(rows.length).toBeGreaterThan(0);

      // Temp tables are automatically dropped after transaction ends
    });
  });
});
