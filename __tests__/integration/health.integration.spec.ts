// __tests__/integration/health.integration.spec.ts
import { HealthService } from '@/health/services';
import { BaseHealthService } from '@/health/contracts';
import { HealthModule } from '@/health/health.module';
import { TestContext } from '../common/test-context';

describe('HealthModule (Integration)', () => {
  const context = new TestContext();
  let healthService: HealthService;

  beforeAll(async () => {
    await context.setup({
      imports: [HealthModule],
    });
    healthService = context.getService(HealthService);
  });

  afterAll(async () => {
    await context.teardown();
  });

  describe('liveness probe', () => {
    it('returns up status with uptime', () => {
      const result = healthService.liveness();

      expect(result.status).toBe('up');
      expect(result.uptimeMs).toBeGreaterThan(0);
    });
  });

  describe('readiness probe', () => {
    it('returns ok status when database is connected', async () => {
      const result = await healthService.readinessOrThrow();

      expect(result.status).toBe('ok');
      expect(result.details).toHaveProperty('database');
      expect(result.details.database.status).toBe('up');
    });
  });

  describe('assertReadiness', () => {
    it('succeeds when all probes are healthy', async () => {
      await expect(healthService.assertReadiness()).resolves.toBeUndefined();
    });
  });

  describe('contract export', () => {
    it('exports BaseHealthService for bootstrap', () => {
      const baseService = context.getService<BaseHealthService>(BaseHealthService);

      expect(baseService).toBeDefined();
      expect(baseService).toBeInstanceOf(HealthService);
      expect(baseService.assertReadiness).toBeDefined();
    });
  });
});
