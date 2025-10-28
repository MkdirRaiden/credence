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

  describe('liveness', () => {
    it('returns raw liveness data', () => {
      const result = healthService.liveness();
      
      expect(result).toBeDefined();
      expect(result.status).toBe('up');
      expect(result.uptimeMs).toBeGreaterThan(0);
      expect(typeof result.uptimeMs).toBe('number');
    });
  });

  describe('readinessOrThrow', () => {
    it('returns raw readiness data when database is up', async () => {
      const result = await healthService.readinessOrThrow();
      
      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
      expect(result.details).toBeDefined();
      expect(result.details.database.status).toBe('up');
    });

    it('checks database connectivity', async () => {
      const result = await healthService.readinessOrThrow();
      
      expect(result.details).toBeDefined();
      expect(result.details.database).toBeDefined();
      expect(result.details.database.status).toBe('up');
    });
  });
});
