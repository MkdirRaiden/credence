// __tests__/unit/common/utils/retry-database.spec.ts
import { retry } from '@/common/utils';
import type { LoggerService } from '@/logger/services';

describe('retry utility', () => {
  const createMockLogger = (): Partial<LoggerService> => ({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  });

  it('retries failed operation and eventually succeeds', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('OK');

    const mockLogger = createMockLogger();

    const result = await retry(operation, {
      retries: 2,
      delay: 10,
      delayFn: async () => Promise.resolve(),
      logger: mockLogger as LoggerService,
      context: 'DB',
    });

    expect(result).toBe('OK');
    expect(operation).toHaveBeenCalledTimes(2);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      '[DB] Retry attempt 1/2 failed. Retrying in 10ms...', // ← Include /2
      'Retry', // ← Just 'Retry'
    );
  });

  it('throws after all retries fail', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('fail'));
    const mockLogger = createMockLogger();

    await expect(
      retry(operation, {
        retries: 1,
        delay: 10,
        delayFn: async () => Promise.resolve(),
        logger: mockLogger as LoggerService,
        context: 'DB',
      }),
    ).rejects.toThrow('fail');

    expect(operation).toHaveBeenCalledTimes(2);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      '[DB] Retry attempt 1/1 failed. Retrying in 10ms...',
      'Retry',
    );
  });

  it('uses exponential backoff when enabled', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('OK');

    const mockLogger = createMockLogger();
    const delayFn = jest.fn();

    await retry(operation, {
      retries: 2,
      delay: 10,
      exponentialBackoff: true,
      delayFn,
      logger: mockLogger as LoggerService,
      context: 'DB',
    });

    // First failure: delay * 2^0 = 10
    expect(delayFn).toHaveBeenCalledWith(10);
  });

  it('handles synchronous operations', async () => {
    const operation = jest.fn().mockReturnValue('sync-result');

    const result = await retry(operation, {
      retries: 1,
      delay: 5,
      delayFn: async () => Promise.resolve(),
    });

    expect(result).toBe('sync-result');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('does not log when logger not provided', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('OK');

    const result = await retry(operation, {
      retries: 1,
      delay: 5,
      delayFn: async () => Promise.resolve(),
      context: 'DB',
      // No logger provided
    });

    expect(result).toBe('OK');
  });
});
