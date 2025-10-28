// __tests__/unit/health/helpers/health-status.spec.ts
import { getLiveness, getReadiness } from '@/health/helpers';
import type { PrismaProbe } from '@/health/probes/prisma.probe';

describe('Health helpers', () => {
  describe('getLiveness', () => {
    it('returns status up with uptimeMs', () => {
      const result = getLiveness();
      expect(result.status).toBe('up');
      expect(typeof result.uptimeMs).toBe('number');
      expect(result.uptimeMs).toBeGreaterThan(0);
    });
  });

  describe('getReadiness', () => {
    it('returns ok when prisma probe is up', async () => {
      const mockProbe = {
        name: 'prisma',
        check: jest.fn().mockResolvedValue({ 
          name: 'prisma', 
          status: 'up' 
        }),
      } as unknown as PrismaProbe;

      const result = await getReadiness(mockProbe);
      
      expect(result.status).toBe('ok');
      expect(result.details.database.status).toBe('up');
      expect(mockProbe.check).toHaveBeenCalledTimes(1);
    });

    it('returns error when prisma probe is down', async () => {
      const mockProbe = {
        name: 'prisma',
        check: jest.fn().mockResolvedValue({
          name: 'prisma',
          status: 'down',
          message: 'Connection failed',
        }),
      } as unknown as PrismaProbe;

      const result = await getReadiness(mockProbe);
      
      expect(result.status).toBe('error');
      expect(result.details.database.status).toBe('down');
      expect(result.details.database.message).toBe('Connection failed');
      expect(mockProbe.check).toHaveBeenCalledTimes(1);
    });

    it('returns error without message when probe fails', async () => {
      const mockProbe = {
        name: 'prisma',
        check: jest.fn().mockResolvedValue({
          name: 'prisma',
          status: 'down',
        }),
      } as unknown as PrismaProbe;

      const result = await getReadiness(mockProbe);
      
      expect(result.status).toBe('error');
      expect(result.details.database.status).toBe('down');
      expect(result.details.database.message).toBeUndefined();
    });
  });
});
