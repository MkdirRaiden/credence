// __tests__/unit/health/services/prisma.probe.spec.ts
import { PrismaProbeService } from '@/health/services/probes/prisma.probe';
import { PrismaService } from '@/database/prisma.service';

describe('PrismaProbeService', () => {
  let probe: PrismaProbeService;
  let mockPrisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    mockPrisma = {
      $queryRaw: jest.fn(),
    } as any; // Cast to 'any' to bypass strict PrismaPromise typing in tests

    probe = new PrismaProbeService(mockPrisma);
  });

  it('returns up status on successful query', async () => {
    (mockPrisma.$queryRaw as jest.Mock).mockResolvedValue([{ result: 1 }]);

    const result = await probe.check();

    expect(result.name).toBe('database');
    expect(result.status).toBe('up');
    expect(result.message).toBeUndefined();
  });

  it('returns down status on query failure', async () => {
    const error = new Error('Connection refused');
    (mockPrisma.$queryRaw as jest.Mock).mockRejectedValue(error);

    const result = await probe.check();

    expect(result.name).toBe('database');
    expect(result.status).toBe('down');
    expect(result.message).toBe('Connection refused');
  });

  it('enforces timeout when provided', async () => {
    jest.useFakeTimers();
    (mockPrisma.$queryRaw as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 5000)),
    );

    const checkPromise = probe.check({ timeout: 1000 });
    jest.advanceTimersByTime(1000);

    const result = await checkPromise;

    expect(result.status).toBe('down');
    expect(result.message).toContain('Timeout');

    jest.useRealTimers();
  });

  it('clears timeout after successful check', async () => {
    jest.useFakeTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    (mockPrisma.$queryRaw as jest.Mock).mockResolvedValue([]);

    await probe.check({ timeout: 1000 });

    expect(clearTimeoutSpy).toHaveBeenCalled();

    jest.useRealTimers();
    clearTimeoutSpy.mockRestore();
  });

  it('handles non-Error exceptions', async () => {
    (mockPrisma.$queryRaw as jest.Mock).mockRejectedValue('Unknown error');

    const result = await probe.check();

    expect(result.status).toBe('down');
    expect(result.message).toBe('Unknown error');
  });
});
