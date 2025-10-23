// __tests__/unit/health/helpers/readiness.spec.ts
import { getLiveness, getReadiness } from '@/health/helpers';
import type { DatabaseProbe } from '@/health/probes/database.probe';

describe('Health helpers', () => {
  describe('getLiveness', () => {
    it('should return status up and uptimeMs', () => {
      const result = getLiveness();
      expect(result.status).toBe('up');
      expect(typeof result.uptimeMs).toBe('number');
      expect(result.uptimeMs).toBeGreaterThan(0);
    });
  });

  describe('getReadiness', () => {
    it('should return ok when db probe is up', async () => {
      const mockProbe: Partial<DatabaseProbe> = {
        check: jest.fn().mockResolvedValue({ status: 'up', name: 'database' }),
      };
      const result = await getReadiness(mockProbe as DatabaseProbe);
      expect(result.status).toBe('ok');
      expect(result.details.database.status).toBe('up');
    });

    it('should return error when db probe is down', async () => {
      const mockProbe: Partial<DatabaseProbe> = {
        check: jest.fn().mockResolvedValue({
          status: 'down',
          name: 'database',
          message: 'Connection failed',
        }),
      };
      const result = await getReadiness(mockProbe as DatabaseProbe);
      expect(result.status).toBe('error');
      expect(result.details.database.status).toBe('down');
      expect(result.details.database.message).toBe('Connection failed');
    });
  });
});
