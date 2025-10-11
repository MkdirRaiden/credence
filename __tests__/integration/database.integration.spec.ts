import { Test } from '@nestjs/testing';
import { DatabaseModule } from '@/database/database.module';
import { ConfigModule } from '@/config/config.module';
import { DatabasePrismaService } from '@/database/database-prisma.service';

jest.setTimeout(20000); // Increase timeout for DB retries

describe('DatabasePrismaService (Integration)', () => {
  let db: DatabasePrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, DatabaseModule],
    }).compile();

    db = moduleRef.get(DatabasePrismaService);

    // Connect to DB
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

  it('creates, inserts, and queries a temp table', async () => {
    await db.$executeRaw`CREATE TABLE IF NOT EXISTS integration_test (id SERIAL PRIMARY KEY, name TEXT)`;
    await db.$executeRaw`INSERT INTO integration_test (name) VALUES ('credence_test')`;

    const rows = await db.$queryRaw<{ id: number; name: string }[]>`
      SELECT * FROM integration_test WHERE name='credence_test'
    `;

    expect(rows.length).toBeGreaterThan(0);

    await db.$executeRaw`TRUNCATE TABLE integration_test`;
  });
});
