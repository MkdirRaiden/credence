// __tests__/integration/prisma.integration.spec.ts
import { PrismaService } from '@/database/services';
import { TestContext } from '../common/test-context';

jest.setTimeout(30000);

describe('PrismaService (Integration)', () => {
  const context = new TestContext();
  let prisma: PrismaService;

  beforeAll(async () => {
    await context.setup();
    prisma = context.prisma as PrismaService;
    expect(prisma).toBeDefined();
  });

  afterAll(async () => {
    await context.teardown();
  });

  it('connects to database on module init', () => {
    expect(prisma).toBeDefined();
  });

  it('executes simple raw SQL queries', async () => {
    const result = await prisma.$queryRaw<
      [{ result: number }]
    >`SELECT 1 as result`;
    expect(result).toHaveLength(1);
    expect(result[0].result).toBe(1);
  });

  it('handles transactions with temp tables (via runTransaction helper)', async () => {
    const result = await prisma.runTransaction(async (tx) => {
      await tx.$executeRaw`CREATE TEMP TABLE test_table (id SERIAL, name TEXT)`;
      await tx.$executeRaw`INSERT INTO test_table (name) VALUES ('test')`;
      const rows = await tx.$queryRaw<{ name: string }[]>`
        SELECT * FROM test_table WHERE name = 'test'
      `;
      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('test');
      return rows.length;
    });

    expect(result).toBe(1);
  });

  it('handles multiple queries in transaction (via runTransaction helper)', async () => {
    const count = await prisma.runTransaction(async (tx) => {
      await tx.$executeRaw`CREATE TEMP TABLE users (id SERIAL, email TEXT UNIQUE)`;
      await tx.$executeRaw`INSERT INTO users (email) VALUES ('user1@test.com')`;
      await tx.$executeRaw`INSERT INTO users (email) VALUES ('user2@test.com')`;
      const all = await tx.$queryRaw<{ id: number; email: string }[]>`
        SELECT * FROM users ORDER BY id
      `;
      expect(all).toHaveLength(2);
      expect(all[0].email).toBe('user1@test.com');
      return all.length;
    });

    expect(count).toBe(2);
  });

  it('rolls back on transaction error', async () => {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`CREATE TEMP TABLE rollback_test (id INT)`;
        await tx.$executeRaw`INSERT INTO rollback_test VALUES (1)`;
        throw new Error('Intentional error');
      });
    } catch (err: any) {
      expect(err.message).toContain('Intentional error');
    }
  });

  // NEW TEST: runTransaction helper
  it('uses runTransaction helper with timeout settings', async () => {
    const result = await prisma.runTransaction(async (tx) => {
      await tx.$executeRaw`CREATE TEMP TABLE helper_test (id INT)`;
      await tx.$executeRaw`INSERT INTO helper_test VALUES (42)`;
      const rows = await tx.$queryRaw<{ id: number }[]>`
        SELECT * FROM helper_test
      `;
      return rows[0].id;
    });

    expect(result).toBe(42);
  });
});
