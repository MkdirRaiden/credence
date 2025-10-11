import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@/config/config.module';
import { DatabaseModule } from '@/database/database.module';
import { HealthController } from '@/health/health.controller';
import { HealthService } from '@/health/health.service';
import { LoggerService } from '@/logger/logger.service';
import { DatabasePrismaService } from '@/database/database-prisma.service';

jest.setTimeout(20000);

describe('Health Module (Integration)', () => {
  let app: INestApplication;
  let dbService: DatabasePrismaService;

  beforeAll(async () => {
    // Prevent HealthService periodic check from running in tests
    jest
      .spyOn(HealthService.prototype as any, 'startPeriodicHealthCheck')
      .mockImplementation(() => {});

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, DatabaseModule],
      controllers: [HealthController],
      providers: [HealthService, LoggerService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    dbService = moduleRef.get(DatabasePrismaService);
    await dbService.onModuleInit?.();
  });

  afterAll(async () => {
    if (dbService?.onApplicationShutdown) {
      await dbService.onApplicationShutdown();
    }
    await app.close();
  });

  it('GET /health/live -> up', async () => {
    const res = await request(app.getHttpServer()).get('/health/live');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('up');
  });

  it('GET /health/ready -> ok when DB up', async () => {
    const res = await request(app.getHttpServer()).get('/health/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.details.database.status).toBe('up');
  });

  it('GET /health/ready -> 503 when DB errors', async () => {
    // Simulate DB failure
    const spy = jest
      .spyOn(dbService, '$queryRaw' as any)
      .mockImplementationOnce(() => {
        throw new Error('simulated DB failure');
      });

    const res = await request(app.getHttpServer()).get('/health/ready');
    expect(res.status).toBe(503);

    spy.mockRestore();
  });
});
