// __tests__/unit/health/helpers/health-status.spec.ts
import { getLiveness, getReadiness } from '@/health/helpers';
import type { PrismaProbe } from '@/health/probes/prisma.probe';

describe('Health helpers', () => {
  describe('getLiveness', () => {
    it('returns status up with uptimeMs', () => {
      const result = getLiveness();

      expect(result.status).toBe('up');
      expect(result.uptimeMs).toBeGreaterThan(0);
    });
  });

  describe('getReadiness', () => {
    it('returns ok when probe is up and error when down', async () => {
      const upProbe = {
        check: jest.fn().mockResolvedValue({
          name: 'prisma',
          status: 'up',
        }),
      } as unknown as PrismaProbe;

      const upResult = await getReadiness(upProbe);
      expect(upResult.status).toBe('ok');
      expect(upResult.details.database.status).toBe('up');

      const downProbe = {
        check: jest.fn().mockResolvedValue({
          name: 'prisma',
          status: 'down',
          message: 'Connection failed',
        }),
      } as unknown as PrismaProbe;

      const downResult = await getReadiness(downProbe);
      expect(downResult.status).toBe('error');
      expect(downResult.details.database.status).toBe('down');
      expect(downResult.details.database.message).toBe('Connection failed');
    });

    it('handles probe failure without message', async () => {
      const probe = {
        check: jest.fn().mockResolvedValue({
          name: 'prisma',
          status: 'down',
        }),
      } as unknown as PrismaProbe;

      const result = await getReadiness(probe);

      expect(result.status).toBe('error');
      expect(result.details.database.status).toBe('down');
      expect(result.details.database.message).toBeUndefined();
    });
  });
});
