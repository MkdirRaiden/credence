// __tests__/integration/health.integration.spec.ts
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@/config/config.module';
import { LoggerModule } from '@/logger/logger.module';
import { DatabaseModule } from '@/database/database.module';
import { HealthModule } from '@/health/health.module';
import { HealthService } from '@/health/health.service';
import { PrismaService } from '@/database/prisma.service';

jest.setTimeout(20000);

describe('HealthService (Integration)', () => {
  let healthService: HealthService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule,
        LoggerModule,
        DatabaseModule,
        HealthModule,
      ],
    }).compile();

    healthService = moduleRef.get(HealthService);
    prismaService = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('assertReadiness', () => {
    it('passes when database is connected', async () => {
      await expect(healthService.assertReadiness()).resolves.not.toThrow();
    });
  });

  describe('liveEnvelope', () => {
    it('returns liveness response', () => {
      const result = healthService.liveEnvelope();
      
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toBeDefined();
      expect(result.data!.status).toBe('up');  // Add ! here
      expect(result.data!.uptimeMs).toBeGreaterThan(0);  // Add ! here
    });
  });

  describe('readyEnvelopeOrThrow', () => {
    it('returns readiness response when database is up', async () => {
      const result = await healthService.readyEnvelopeOrThrow();
      
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.data).toBeDefined();
      expect(result.data!.status).toBe('ok');  // Add ! here
      expect(result.data!.details.database.status).toBe('up');  // Add ! here
    });

    it('checks database connectivity', async () => {
      const result = await healthService.readyEnvelopeOrThrow();
      expect(result.data).toBeDefined();
      expect(result.data!.details.database.status).toBe('up');  // Add ! here
    });
  });
});
