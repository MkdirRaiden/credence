// __tests__/unit/bootstrap/readiness-check.spec.ts
import { runReadinessChecks } from '@/bootstrap/helpers/readiness-check';
import type { INestApplication } from '@nestjs/common';
import { HealthService } from '@/health/health.service';

describe('runReadinessChecks', () => {
  let mockApp: jest.Mocked<INestApplication>;
  let mockHealth: any;

  beforeEach(() => {
    mockHealth = { assertReadiness: jest.fn().mockResolvedValue(true) };
    mockApp = {
      get: jest.fn().mockReturnValue(mockHealth),
    } as any;
  });

  it('✅ calls assertReadiness successfully', async () => {
    await runReadinessChecks(mockApp);
    expect(mockApp.get).toHaveBeenCalledWith(HealthService, { strict: false });
    expect(mockHealth.assertReadiness).toHaveBeenCalled();
  });

  it('🚫 throws if HealthService is missing', async () => {
    mockApp.get.mockReturnValueOnce(undefined);
    await expect(runReadinessChecks(mockApp)).rejects.toThrow(
      'Readiness check unavailable: HealthService not found',
    );
  });

  it('🚫 throws if assertReadiness is not a function', async () => {
    mockApp.get.mockReturnValueOnce({});
    await expect(runReadinessChecks(mockApp)).rejects.toThrow(
      'Readiness check unavailable: HealthService.assertReadiness not found',
    );
  });
});
