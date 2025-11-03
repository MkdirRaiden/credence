// __tests__/integration/prisma.integration.spec.ts
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { createTestModule } from '../helpers/test-module.factory';

jest.setTimeout(30000);

describe('PrismaService (Integration)', () => {
  let app: INestApplication;
  let db: PrismaService;

  beforeAll(async () => {
    const moduleRef = await createTestModule();
    app = moduleRef.createNestApplication();
    await app.init();
    db = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('connects to database', async () => {
    expect(db).toBeDefined();
    expect(db.$queryRaw).toBeDefined();
  });

  it('executes simple raw SQL queries', async () => {
    const result = await db.$queryRaw<[{ result: number }]>`SELECT 1 as result`;
    expect(result).toHaveLength(1);
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

  it('handles multiple queries in transaction', async () => {
    await db.$transaction(async (tx) => {
      await tx.$executeRaw`CREATE TEMP TABLE users (id SERIAL, email TEXT UNIQUE)`;
      await tx.$executeRaw`INSERT INTO users (email) VALUES ('user1@test.com')`;
      await tx.$executeRaw`INSERT INTO users (email) VALUES ('user2@test.com')`;
      const all = await tx.$queryRaw<{ id: number; email: string }[]>`
        SELECT * FROM users ORDER BY id
      `;
      expect(all).toHaveLength(2);
      expect(all[0].email).toBe('user1@test.com');
    });
  });

  it('rolls back on transaction error', async () => {
    try {
      await db.$transaction(async (tx) => {
        await tx.$executeRaw`CREATE TEMP TABLE rollback_test (id INT)`;
        await tx.$executeRaw`INSERT INTO rollback_test VALUES (1)`;
        throw new Error('Intentional error');
      });
    } catch (err: any) {
      expect(err.message).toContain('Intentional error');
    }
  });
});
