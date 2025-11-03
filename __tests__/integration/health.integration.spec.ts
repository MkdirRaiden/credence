// __tests__/integration/health.integration.spec.ts
import { INestApplication } from '@nestjs/common';
import { HealthService } from '@/health/health.service';
import { HealthModule } from '@/health/health.module';
import { createTestModule } from '../helpers/test-module.factory';

jest.setTimeout(30000);

describe('HealthService (Integration)', () => {
  let app: INestApplication;
  let healthService: HealthService;

  beforeAll(async () => {
    const moduleRef = await createTestModule({ imports: [HealthModule] });
    app = moduleRef.createNestApplication();
    await app.init();
    healthService = moduleRef.get(HealthService);
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('passes readiness check with connected database', async () => {
    await expect(healthService.assertReadiness()).resolves.not.toThrow();
  });

  it('returns liveness with uptime', () => {
    const result = healthService.liveness();
    expect(result.status).toBe('up');
    expect(result.uptimeMs).toBeGreaterThan(0);
  });

  it('returns readiness with database status ok', async () => {
    const result = await healthService.readinessOrThrow();
    expect(result.status).toBe('ok');
    expect(result.details.database?.status).toBe('up');
  });

  it('readiness includes all probe details', async () => {
    const result = await healthService.readinessOrThrow();
    expect(Object.keys(result.details).length).toBeGreaterThan(0);
    Object.values(result.details).forEach((detail: any) => {
      expect(detail.status).toBeDefined();
      expect(['up', 'down']).toContain(detail.status);
    });
  });
});
