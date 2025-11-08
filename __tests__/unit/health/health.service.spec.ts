// __tests__/unit/health/services/health.service.spec.ts
import { HealthService, SchedulerService } from '@/health/services';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import type { AppConfig } from '@/common/interfaces';
import type { Probe } from '@/health/health.interface';

describe('HealthService', () => {
  let healthService: HealthService;
  let mockProbes: Probe[];
  let mockScheduler: jest.Mocked<SchedulerService>;
  let mockConfigService: jest.Mocked<ConfigService<AppConfig, true>>;

  beforeEach(() => {
    mockScheduler = {
      start: jest.fn(),
    } as any;

    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'database') {
          return {
            probeCheckTimeoutMs: 5000,
          };
        }
        return {};
      }),
    } as any;

    mockProbes = [
      {
        name: 'database',
        check: jest.fn().mockResolvedValue({ name: 'database', status: 'up' }),
      },
    ];

    healthService = new HealthService(
      mockProbes,
      mockScheduler,
      mockConfigService,
    );
  });

  describe('onModuleInit', () => {
    it('starts scheduler with probes', () => {
      healthService.onModuleInit();

      expect(mockScheduler.start).toHaveBeenCalledWith(mockProbes);
    });
  });

  describe('liveness', () => {
    it('returns up status with uptime', () => {
      const result = healthService.liveness();

      expect(result.status).toBe('up');
      expect(result.uptimeMs).toBeGreaterThan(0);
      expect(typeof result.uptimeMs).toBe('number');
    });
  });

  describe('readinessOrThrow', () => {
    it('returns readiness status when all probes are up', async () => {
      const result = await healthService.readinessOrThrow();

      expect(result.status).toBe('ok');
      expect(result.details.database.status).toBe('up');
    });

    it('throws HttpException when any probe fails', async () => {
      mockProbes[0].check = jest
        .fn()
        .mockResolvedValue({
          name: 'database',
          status: 'down',
          message: 'Lost',
        });

      try {
        await healthService.readinessOrThrow();
        fail('Should have thrown HttpException');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        if (err instanceof HttpException) {
          expect(err.getStatus()).toBe(HttpStatus.SERVICE_UNAVAILABLE);
        }
      }
    });

    it('includes failure details in response', async () => {
      mockProbes[0].check = jest
        .fn()
        .mockResolvedValue({
          name: 'database',
          status: 'down',
          message: 'Connection lost',
        });

      try {
        await healthService.readinessOrThrow();
        fail('Should have thrown');
      } catch (err) {
        if (err instanceof HttpException) {
          const response = err.getResponse() as any;
          expect(response.status).toBe('error');
          expect(response.details.database.message).toBe('Connection lost');
        }
      }
    });
  });

  describe('assertReadiness', () => {
    it('resolves successfully when all probes are up', async () => {
      await expect(healthService.assertReadiness()).resolves.toBeUndefined();
    });

    it('throws Error on readiness failure (bootstrap phase)', async () => {
      mockProbes[0].check = jest
        .fn()
        .mockResolvedValue({
          name: 'database',
          status: 'down',
          message: 'Lost',
        });

      try {
        await healthService.assertReadiness();
        fail('Should have thrown Error');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect((err as Error).message).toContain('Readiness check failed');
      }
    });

    it('includes probe details in error message', async () => {
      mockProbes[0].check = jest
        .fn()
        .mockResolvedValue({
          name: 'database',
          status: 'down',
          message: 'Lost',
        });

      try {
        await healthService.assertReadiness();
        fail('Should have thrown');
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).toContain('database');
        }
      }
    });
  });
});
