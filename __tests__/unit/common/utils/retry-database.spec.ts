// __tests__/unit/common/utils/retry-database.spec.ts
import { retry } from '@/common/utils/retry-database';
import { BootstrapLogger } from '@/logger/bootstrap-logger';
import type { LoggerService } from '@/logger/logger.service';

describe('retry utility', () => {
  // Utility factory for test logger mocks
  const createMockLogger = () => ({
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
      // safe cast through unknown avoids TS2352 warning
      logger: mockLogger as unknown as LoggerService,
      context: 'DB',
    });

    expect(result).toBe('OK');
    expect(operation).toHaveBeenCalledTimes(2);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      '[DB] Retry attempt 1 failed. Retrying in 10ms...', "Database.Retry"
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
        logger: mockLogger as unknown as LoggerService,
        context: 'DB',
      }),
    ).rejects.toThrow('fail');

    expect(operation).toHaveBeenCalledTimes(2);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      '[DB] Retry attempt 1 failed. Retrying in 10ms...', "Database.Retry"
    );
  });

  it('uses BootstrapLogger fallback if no logger provided', async () => {
    const operation = jest.fn().mockResolvedValue('OK');
    const spy = jest
      .spyOn(BootstrapLogger.prototype, 'warn')
      .mockImplementation(() => undefined);

    const result = await retry(operation, {
      retries: 1,
      delay: 5,
      delayFn: async () => Promise.resolve(),
      context: 'FallbackTest',
    });

    expect(result).toBe('OK');
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
