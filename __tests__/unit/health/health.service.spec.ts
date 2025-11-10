// __tests__/unit/health/health.service.spec.ts
import { HealthService, SchedulerService } from '@/health/services';
import { HttpException, HttpStatus } from '@nestjs/common';
import type { Probe } from '@/health/health.interface';

describe('HealthService', () => {
  let healthService: HealthService;
  let mockProbes: Probe[];
  let mockScheduler: jest.Mocked<SchedulerService>;

  beforeEach(() => {
    mockScheduler = {
      start: jest.fn(),
    } as any;

    mockProbes = [
      {
        name: 'database',
        check: jest.fn().mockResolvedValue({ name: 'database', status: 'up' }),
      },
    ];

    healthService = new HealthService(mockProbes, mockScheduler);
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
      mockProbes[0].check = jest.fn().mockResolvedValue({
        name: 'database',
        status: 'down',
        message: 'Lost',
      });

      await expect(healthService.readinessOrThrow()).rejects.toThrow(
        HttpException,
      );
    });

    it('throws SERVICE_UNAVAILABLE status on failure', async () => {
      mockProbes[0].check = jest.fn().mockResolvedValue({
        name: 'database',
        status: 'down',
        message: 'Connection lost',
      });

      await expect(healthService.readinessOrThrow()).rejects.toMatchObject({
        message: expect.anything(),
        response: {
          status: 'error',
          details: expect.objectContaining({
            database: expect.objectContaining({ status: 'down' }),
          }),
        },
        status: HttpStatus.SERVICE_UNAVAILABLE,
      });
    });
  });

  describe('assertReadiness', () => {
    it('resolves successfully when all probes are up', async () => {
      await expect(healthService.assertReadiness()).resolves.toBeUndefined();
    });

    it('throws Error on readiness failure with probe details', async () => {
      mockProbes[0].check = jest.fn().mockResolvedValue({
        name: 'database',
        status: 'down',
        message: 'Lost',
      });

      await expect(healthService.assertReadiness()).rejects.toThrow(
        /Readiness check failed.*database/,
      );
    });
  });
});
