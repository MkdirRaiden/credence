// __tests__/unit/common/utils/retry.spec.ts
import { retry } from '@/common/utils';
import type { LoggerService } from '@/logger/services';

describe('Retry Utility', () => {
  const createMockLogger = (): Partial<LoggerService> => ({
    warn: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  });

  const mockDelayFn = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retries failed operations and succeeds on recovery', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('OK');

    const result = await retry(operation, {
      retries: 2,
      delay: 10,
      delayFn: mockDelayFn,
      logger: createMockLogger() as LoggerService,
      context: 'Database',
    });

    expect(result).toBe('OK');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('throws after all retries exhausted', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('fail'));
    const mockLogger = createMockLogger();

    await expect(
      retry(operation, {
        retries: 1,
        delay: 10,
        delayFn: mockDelayFn,
        logger: mockLogger as LoggerService,
        context: 'Database',
      }),
    ).rejects.toThrow('fail');

    expect(operation).toHaveBeenCalledTimes(2);

    // Logger context is always 'Retry', custom context in message
    expect(mockLogger.warn).toHaveBeenCalledWith(
      '[Database] Retry attempt 1/1 failed. Retrying in 10ms...',
      'Retry', // FIXED
    );
  });

  it('applies exponential backoff when enabled', async () => {
    const delayFn = jest.fn().mockResolvedValue(undefined);
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('OK');

    await retry(operation, {
      retries: 3,
      delay: 10,
      exponentialBackoff: true,
      delayFn,
      logger: createMockLogger() as LoggerService,
      context: 'Database',
    });

    expect(delayFn).toHaveBeenCalledTimes(2);
    expect(delayFn).toHaveBeenNthCalledWith(1, 10);
    expect(delayFn).toHaveBeenNthCalledWith(2, 20);
  });

  it('uses linear delay by default', async () => {
    const delayFn = jest.fn().mockResolvedValue(undefined);
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('OK');

    await retry(operation, {
      retries: 3,
      delay: 10,
      delayFn,
      logger: createMockLogger() as LoggerService,
      context: 'Database',
    });

    expect(delayFn).toHaveBeenCalledTimes(2);
    expect(delayFn).toHaveBeenNthCalledWith(1, 10);
    expect(delayFn).toHaveBeenNthCalledWith(2, 10);
  });

  it('handles sync operations and optional logger', async () => {
    const operation = jest.fn().mockReturnValue('sync-result');

    const result = await retry(operation, {
      retries: 1,
      delay: 5,
      delayFn: mockDelayFn,
    });

    expect(result).toBe('sync-result');
    expect(operation).toHaveBeenCalledTimes(1);
    expect(mockDelayFn).not.toHaveBeenCalled();
  });

  it('succeeds on first attempt without retrying', async () => {
    const operation = jest.fn().mockResolvedValue('immediate-success');
    const mockLogger = createMockLogger();

    const result = await retry(operation, {
      retries: 3,
      delay: 10,
      delayFn: mockDelayFn,
      logger: mockLogger as LoggerService,
      context: 'Database',
    });

    expect(result).toBe('immediate-success');
    expect(operation).toHaveBeenCalledTimes(1);
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('logs retry attempts with proper context', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('attempt 1'))
      .mockRejectedValueOnce(new Error('attempt 2'))
      .mockResolvedValue('OK');

    const mockLogger = createMockLogger();

    await retry(operation, {
      retries: 3,
      delay: 5,
      delayFn: mockDelayFn,
      logger: mockLogger as LoggerService,
      context: 'Prisma',
    });

    expect(mockLogger.warn).toHaveBeenCalledTimes(2);

    // Logger context is always 'Retry', custom context in message
    expect(mockLogger.warn).toHaveBeenNthCalledWith(
      1,
      '[Prisma] Retry attempt 1/3 failed. Retrying in 5ms...',
      'Retry', // FIXED
    );
    expect(mockLogger.warn).toHaveBeenNthCalledWith(
      2,
      '[Prisma] Retry attempt 2/3 failed. Retrying in 5ms...',
      'Retry', // FIXED
    );
  });

  it('does not log when context is not provided', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('OK');

    const mockLogger = createMockLogger();

    await retry(operation, {
      retries: 2,
      delay: 5,
      delayFn: mockDelayFn,
      logger: mockLogger as LoggerService,
    });

    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('handles errors without messages', async () => {
    const operation = jest.fn().mockRejectedValue(new Error());
    const mockLogger = createMockLogger();

    await expect(
      retry(operation, {
        retries: 1,
        delay: 5,
        delayFn: mockDelayFn,
        logger: mockLogger as LoggerService,
        context: 'Database',
      }),
    ).rejects.toThrow();

    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('respects zero retries', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('no retry'));

    await expect(
      retry(operation, {
        retries: 0,
        delay: 10,
        delayFn: mockDelayFn,
      }),
    ).rejects.toThrow('no retry');

    expect(operation).toHaveBeenCalledTimes(1);
    expect(mockDelayFn).not.toHaveBeenCalled();
  });
});
