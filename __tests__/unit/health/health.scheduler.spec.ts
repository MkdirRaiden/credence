// __tests__/unit/health/health.scheduler.spec.ts
import { SchedulerService } from '@/health/services';
import { LoggerService } from '@/logger/services';
import type { Probe } from '@/health/health.interface';
import { LOG_CONTEXTS } from '@/common/constants';

describe('SchedulerService', () => {
  let scheduler: SchedulerService;
  let mockLogger: jest.Mocked<LoggerService>;
  let upProbe: Probe;
  let downProbe: Probe;

  beforeEach(() => {
    jest.useFakeTimers();

    mockLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;

    upProbe = {
      name: 'database',
      check: jest.fn().mockResolvedValue({ name: 'database', status: 'up' }),
    };

    downProbe = {
      name: 'database',
      check: jest.fn().mockResolvedValue({
        name: 'database',
        status: 'down',
        message: 'Lost',
      }),
    };

    scheduler = new SchedulerService(mockLogger);
  });

  afterEach(() => {
    scheduler.onApplicationShutdown();
    jest.useRealTimers();
  });

  it('prevents duplicate starts', () => {
    scheduler.start([upProbe]);
    const firstInterval = scheduler['interval'];

    scheduler.start([upProbe]);
    expect(scheduler['interval']).toBe(firstInterval);
  });

  it('logs warning only when probes fail', async () => {
    scheduler.start([downProbe]);
    await jest.advanceTimersByTimeAsync(60000);

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Health check failures'),
      LOG_CONTEXTS.HEALTH,
    );
  });

  it('passes timeout to each probe (60% of probe timeout)', async () => {
    scheduler.start([upProbe]);
    await jest.advanceTimersByTimeAsync(60000);

    const probeTimeoutMs = Math.floor(5000 * 0.6);
    expect(upProbe.check).toHaveBeenCalledWith({ timeout: probeTimeoutMs });
  });

  it('handles probe errors gracefully', async () => {
    const errorProbe: Probe = {
      name: 'redis',
      check: jest.fn().mockRejectedValue(new Error('Timeout')),
    };

    scheduler.start([errorProbe]);
    await jest.advanceTimersByTimeAsync(60000);

    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Health check failures'),
      LOG_CONTEXTS.HEALTH,
    );
  });

  it('does not warn when all probes are up', async () => {
    scheduler.start([upProbe]);
    await jest.advanceTimersByTimeAsync(60000);

    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('stops on shutdown', () => {
    scheduler.start([upProbe]);
    scheduler.onApplicationShutdown('SIGTERM');

    expect(scheduler['interval']).toBeUndefined();
    expect(mockLogger.log).toHaveBeenCalledWith(
      expect.stringContaining('HealthScheduler stopped'),
      LOG_CONTEXTS.HEALTH,
    );
  });
});
