// __tests__/unit/health/health.scheduler.spec.ts
import { HealthScheduler } from '@/health/health.scheduler';
import { LoggerService } from '@/logger/logger.service';
import { PROBE_CHECK_TIMEOUT_MS } from '@/common/constants';
import type { Probe } from '@/health/health.interface';

describe('HealthScheduler', () => {
  let scheduler: HealthScheduler;
  let mockLogger: jest.Mocked<LoggerService>;
  let upProbe: Probe;
  let downProbe: Probe;

  beforeEach(() => {
    jest.useFakeTimers();
    mockLogger = { log: jest.fn(), warn: jest.fn() } as any;

    upProbe = {
      name: 'database',
      check: jest.fn().mockResolvedValue({ name: 'database', status: 'up' }),
    };

    downProbe = {
      name: 'database',
      check: jest
        .fn()
        .mockResolvedValue({ name: 'database', status: 'down', message: 'Lost' }),
    };

    scheduler = new HealthScheduler(mockLogger);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('prevents duplicate starts', () => {
    scheduler.start([upProbe], 5000);
    const firstInterval = scheduler['interval'];

    scheduler.start([upProbe], 5000);
    expect(scheduler['interval']).toBe(firstInterval);
  });

  it('logs warning only when probes fail', async () => {
    scheduler.start([downProbe], 1000);
    await jest.advanceTimersByTimeAsync(1000);

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Health check failures'),
      'HealthScheduler',
    );
  });

  it('passes timeout to each probe', async () => {
    scheduler.start([upProbe], 1000);
    await jest.advanceTimersByTimeAsync(1000);

    const probeTimeoutMs = Math.floor(PROBE_CHECK_TIMEOUT_MS * 0.6);
    expect(upProbe.check).toHaveBeenCalledWith({ timeout: probeTimeoutMs });
  });

  it('handles probe errors gracefully', async () => {
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

  it('stops on shutdown', () => {
    scheduler.start([upProbe], 5000);
    scheduler.onApplicationShutdown('SIGTERM');

    expect(scheduler['interval']).toBeUndefined();
    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('HealthScheduler stopped'),
      'HealthScheduler',
    );
  });
});
