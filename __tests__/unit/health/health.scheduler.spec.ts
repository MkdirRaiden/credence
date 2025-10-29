// __tests__/unit/health/health.scheduler.spec.ts
import { HealthScheduler } from '@/health/health.scheduler';
import { LoggerService } from '@/logger/logger.service';
import { PrismaProbe } from '@/health/probes/prisma.probe';

describe('HealthScheduler', () => {
  let scheduler: HealthScheduler;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockProbe: jest.Mocked<PrismaProbe>;

  beforeEach(() => {
    jest.useFakeTimers();
    
    mockLogger = {
      log: jest.fn(),
      warn: jest.fn(),
    } as any;

    mockProbe = {
      check: jest.fn().mockResolvedValue({ name: 'prisma', status: 'up' }),
    } as any;

    scheduler = new HealthScheduler(mockLogger, mockProbe);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts periodic checks and prevents duplicate starts', () => {
    scheduler.start(5000);
    const firstInterval = scheduler['interval'];
    expect(firstInterval).toBeDefined();

    scheduler.start(5000);
    expect(scheduler['interval']).toBe(firstInterval); // Same instance
  });

  it('logs warning when health check fails', async () => {
    mockProbe.check.mockResolvedValue({
      name: 'prisma',
      status: 'down',
      message: 'Connection lost',
    });

    scheduler.start(1000);
    await jest.advanceTimersByTimeAsync(1000);

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Periodic health check failed'),
      'HealthScheduler',
    );
  });

  it('stops on application shutdown', () => {
    scheduler.start(5000);
    scheduler.onApplicationShutdown('SIGTERM');

    expect(scheduler['interval']).toBeUndefined();
    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('HealthScheduler stopped'),
      'HealthScheduler',
    );
  });
});
