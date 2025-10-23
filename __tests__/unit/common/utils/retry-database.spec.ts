// __tests__/unit/common/utils/retry-database.spec.ts
import { retry } from '@/common/utils/retry-database';

describe('retry', () => {
  it('✅ retries failed operation and succeeds', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('OK');

    const mockLogger = { warn: jest.fn() };

    const result = await retry(operation, {
      retries: 2,
      delay: 10,
      delayFn: async () => Promise.resolve(), // no actual wait
      logger: mockLogger, // pass logger explicitly
      context: 'DB',
    });

    expect(result).toBe('OK');
    expect(operation).toHaveBeenCalledTimes(2);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      '[DB] Retry attempt 1 failed. Retrying in 10ms...'
    );
  });

  it('🚫 throws after all retries fail', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('fail'));
    const mockLogger = { warn: jest.fn() };

    await expect(
      retry(operation, {
        retries: 1,
        delay: 10,
        delayFn: async () => Promise.resolve(),
        logger: mockLogger,
        context: 'DB',
      }),
    ).rejects.toThrow('fail');

    expect(operation).toHaveBeenCalledTimes(2);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      '[DB] Retry attempt 1 failed. Retrying in 10ms...'
    );
  });
});
