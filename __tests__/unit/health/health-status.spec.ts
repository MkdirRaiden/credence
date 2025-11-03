// __tests__/unit/health/helpers/health-status.spec.ts
import { getLiveness, getReadiness } from '@/health/helpers';
import type { Probe } from '@/health/health.interface';

describe('Health helpers', () => {
  describe('getLiveness', () => {
    it('returns status up with uptimeMs', () => {
      const result = getLiveness();

      expect(result.status).toBe('up');
      expect(result.uptimeMs).toBeGreaterThan(0);
    });
  });

  describe('getReadiness', () => {
    it('returns ok when all probes are up', async () => {
      const upProbe: Probe = {
        name: 'database',
        check: jest.fn().mockResolvedValue({
          name: 'database',
          status: 'up',
        }),
      };

      const result = await getReadiness([upProbe]);

      expect(result.status).toBe('ok');
      expect(result.details.database).toEqual({ status: 'up' });
    });

    it('returns error when any probe is down', async () => {
      const downProbe: Probe = {
        name: 'database',
        check: jest.fn().mockResolvedValue({
          name: 'database',
          status: 'down',
          message: 'Connection failed',
        }),
      };

      const result = await getReadiness([downProbe]);

      expect(result.status).toBe('error');
      expect(result.details.database).toEqual({
        status: 'down',
        message: 'Connection failed',
      });
    });

    it('returns error if any probe fails, even with others up', async () => {
      const upProbe: Probe = {
        name: 'cache',
        check: jest.fn().mockResolvedValue({
          name: 'cache',
          status: 'up',
        }),
      };

      const downProbe: Probe = {
        name: 'database',
        check: jest.fn().mockResolvedValue({
          name: 'database',
          status: 'down',
        }),
      };

      const result = await getReadiness([upProbe, downProbe]);

      expect(result.status).toBe('error');
      expect(result.details.cache.status).toBe('up');
      expect(result.details.database.status).toBe('down');
    });
  });
});
