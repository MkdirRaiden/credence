// __tests__/integration/prisma.integration.spec.ts
import { PrismaService } from '@/database/prisma.service';
import { createTestModule } from './__helpers__/test-module.factory';
import { disconnectDatabase } from './__helpers__/test-database';

jest.setTimeout(20000);

describe('PrismaService (Integration)', () => {
  let db: PrismaService;

  beforeAll(async () => {
    const moduleRef = await createTestModule();
    db = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await disconnectDatabase(db);
  });

  it('executes simple queries', async () => {
    const result = await db.$queryRaw<[{ result: number }]>`SELECT 1 as result`;
    
    expect(result[0].result).toBe(1);
  });

  it('handles transactions with temp tables', async () => {
    await db.$transaction(async (tx) => {
      await tx.$executeRaw`CREATE TEMP TABLE test_table (id SERIAL, name TEXT)`;
      await tx.$executeRaw`INSERT INTO test_table (name) VALUES ('test')`;

      const rows = await tx.$queryRaw<{ name: string }[]>`
        SELECT * FROM test_table WHERE name = 'test'
      `;

      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('test');
    });
  });
});
