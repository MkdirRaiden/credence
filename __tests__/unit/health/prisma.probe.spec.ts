// __tests__/unit/health/prisma.probe.spec.ts
import { PrismaProbeService } from '@/health/services/probes/prisma.probe';
import { PrismaService } from '@/database/services';

describe('PrismaProbeService', () => {
  let probe: PrismaProbeService;
  let mockPrisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    mockPrisma = {
      $queryRaw: jest.fn(),
    } as any;

    probe = new PrismaProbeService(mockPrisma);
  });

  it('returns up status on successful query', async () => {
    mockPrisma.$queryRaw.mockResolvedValue([{ result: 1 }]);

    const result = await probe.check();

    expect(result).toEqual({ name: 'database', status: 'up' });
    expect(mockPrisma.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('returns down status on query failure', async () => {
    const error = new Error('Connection refused');
    mockPrisma.$queryRaw.mockRejectedValue(error);

    const result = await probe.check();

    expect(result).toEqual({
      name: 'database',
      status: 'down',
      message: 'Connection refused',
    });
  });

  it('uses timeout when provided', async () => {
    jest.useFakeTimers();
    
    // Fix: Return a never-resolving promise (simpler)
    mockPrisma.$queryRaw.mockReturnValue(
      new Promise(() => {}) as any, // Cast to bypass PrismaPromise type
    );

    const checkPromise = probe.check({ timeout: 1000 });
    jest.advanceTimersByTime(1000);

    const result = await checkPromise;

    expect(result.status).toBe('down');
    expect(result.message).toContain('Timeout after 1000ms');

    jest.useRealTimers();
  });

  it('handles non-Error exceptions', async () => {
    mockPrisma.$queryRaw.mockRejectedValue('Unknown error');

    const result = await probe.check();

    expect(result).toEqual({
      name: 'database',
      status: 'down',
      message: 'Unknown error',
    });
  });
});
