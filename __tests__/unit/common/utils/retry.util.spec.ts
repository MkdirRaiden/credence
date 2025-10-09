import { retry } from '@/common/utils/retry.util';

describe('retry', () => {
  it('should retry operation on failure and succeed', async () => {
    let count = 0;
    const op = jest.fn().mockImplementation(() => {
      if (count++ < 2) throw new Error('fail');
      return 'ok';
    });

    const promise = retry(op, {
      retries: 2,
      delay: 1,
      delayFn: async () => {},
    });
    await expect(promise).resolves.toBe('ok');
    expect(op).toHaveBeenCalledTimes(3);
  });

  it('should throw after all retries fail', async () => {
    const op = jest.fn().mockRejectedValue(new Error('fail all'));
    const promise = retry(op, {
      retries: 2,
      delay: 1,
      delayFn: async () => {},
    });
    await expect(promise).rejects.toThrow('fail all');
    expect(op).toHaveBeenCalledTimes(3);
  });

  it('should pass context to console.warn', async () => {
    const op = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok');
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const promise = retry(op, {
      retries: 1,
      delay: 1,
      context: 'Operation',
      delayFn: async () => {},
    });
    await expect(promise).resolves.toBe('ok');

    expect(warnSpy).toHaveBeenCalledWith(
      '[Operation] Retry attempt 1 failed. Retrying in 1ms...',
    );

    warnSpy.mockRestore();
  });
});
