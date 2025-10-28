// __tests__/integration/prisma.integration.spec.ts
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '@/database/database.module';
import { ConfigModule } from '@/config/config.module';
import { LoggerModule } from '@/logger/logger.module'; 
import { PrismaService } from '@/database/prisma.service';

jest.setTimeout(20000);

describe('PrismaService (Integration)', () => {
  let db: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule,
        LoggerModule,      // Add this!
        DatabaseModule,
      ],
    }).compile();

    db = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it('runs SELECT 1', async () => {
    const result = await db.$queryRaw<[{ result: number }]>`SELECT 1 as result`;
    expect(result[0].result).toBe(1);
  });

  it('creates, inserts, and queries a temp table inside a transaction', async () => {
    await db.$transaction(async (tx) => {
      await tx.$executeRaw`CREATE TEMP TABLE integration_test (id SERIAL PRIMARY KEY, name TEXT)`;
      await tx.$executeRaw`INSERT INTO integration_test (name) VALUES ('credence_test')`;

      const rows = await tx.$queryRaw<{ id: number; name: string }[]>`
        SELECT * FROM integration_test WHERE name = 'credence_test'
      `;

      expect(rows).toHaveLength(1);
      expect(rows[0].name).toBe('credence_test');
    });
  });
});
