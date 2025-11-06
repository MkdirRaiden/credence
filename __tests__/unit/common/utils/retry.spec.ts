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
      context: 'DB',
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
        context: 'DB',
      }),
    ).rejects.toThrow('fail');

    expect(operation).toHaveBeenCalledTimes(2);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      '[DB] Retry attempt 1/1 failed. Retrying in 10ms...',
      'Retry',
    );
  });

  it('applies exponential backoff when enabled', async () => {
    const delayFn = jest.fn();
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('OK');

    await retry(operation, {
      retries: 2,
      delay: 10,
      exponentialBackoff: true,
      delayFn,
      logger: createMockLogger() as LoggerService,
    });

    // Exponential: 10 * 2^0 = 10ms
    expect(delayFn).toHaveBeenCalledWith(10);
  });

  it('handles sync operations and optional logger', async () => {
    const operation = jest.fn().mockReturnValue('sync-result');

    const result = await retry(operation, {
      retries: 1,
      delay: 5,
      delayFn: mockDelayFn,
      // No logger, no context
    });

    expect(result).toBe('sync-result');
    expect(operation).toHaveBeenCalledTimes(1);
  });
});
