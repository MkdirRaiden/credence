// __tests__/integration/health.integration.spec.ts
import { INestApplication } from '@nestjs/common';
import { HealthService } from '@/health/health.service';
import { HealthModule } from '@/health/health.module';
import { PROBE_CHECK_TIMEOUT_MS } from '@/common/constants';
import { closeTestApp, createTestModule } from '../helpers/test-module.factory';

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
    if (app) await closeTestApp(app);  // ← Use cleanup helper
  });

  it('bootstrap readiness passes with connected database', async () => {
    await expect(healthService.assertReadiness()).resolves.not.toThrow();
  });

  it('liveness returns uptime', () => {
    const result = healthService.liveness();
    expect(result.status).toBe('up');
    expect(result.uptimeMs).toBeGreaterThan(0);
  });

  it('readiness includes database status', async () => {
    const result = await healthService.readinessOrThrow();
    expect(result.status).toBe('ok');
    expect(result.details.database?.status).toBe('up');
  });

  it('readiness completes within timeout', async () => {
    const start = Date.now();
    await healthService.readinessOrThrow();
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(PROBE_CHECK_TIMEOUT_MS * 1.5);
  });
});
