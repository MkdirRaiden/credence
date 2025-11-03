// __tests__/unit/health/health.scheduler.spec.ts
import { HealthScheduler } from '@/health/health.scheduler';
import { LoggerService } from '@/logger/logger.service';
import type { Probe } from '@/health/health.interface';

describe('HealthScheduler', () => {
  let scheduler: HealthScheduler;
  let mockLogger: jest.Mocked<LoggerService>;
  let upProbe: Probe;
  let downProbe: Probe;

  beforeEach(() => {
    jest.useFakeTimers();

    mockLogger = {
      log: jest.fn(),
      warn: jest.fn(),
    } as any;

    upProbe = {
      name: 'database',
      check: jest.fn().mockResolvedValue({
        name: 'database',
        status: 'up',
      }),
    };

    downProbe = {
      name: 'database',
      check: jest.fn().mockResolvedValue({
        name: 'database',
        status: 'down',
        message: 'Connection lost',
      }),
    };

    scheduler = new HealthScheduler(mockLogger);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('prevents duplicate starts', () => {
    scheduler.start([upProbe], 5000);
    const firstInterval = scheduler['interval'];
    expect(firstInterval).toBeDefined();

    scheduler.start([upProbe], 5000);
    expect(scheduler['interval']).toBe(firstInterval); // Same instance
  });

  it('logs warning when health check fails', async () => {
    scheduler.start([downProbe], 1000);
    await jest.advanceTimersByTimeAsync(1000);

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Health check failures'),
      'HealthScheduler',
    );
  });

  it('does not log warning when all probes pass', async () => {
    scheduler.start([upProbe], 1000);
    await jest.advanceTimersByTimeAsync(1000);

    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('handles probe errors and treats as down', async () => {
    const errorProbe: Probe = {
      name: 'redis',
      check: jest.fn().mockRejectedValue(new Error('Timeout')),
    };

    scheduler.start([errorProbe], 1000);
    await jest.advanceTimersByTimeAsync(1000);

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Health check failures'),
      'HealthScheduler',
    );
  });

  it('stops on application shutdown', () => {
    scheduler.start([upProbe], 5000);
    scheduler.onApplicationShutdown('SIGTERM');

    expect(scheduler['interval']).toBeUndefined();
    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('HealthScheduler stopped'),
      'HealthScheduler',
    );
  });
});
