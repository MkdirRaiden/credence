// __tests__/unit/health/with-timeout.spec.ts
import { withTimeout } from '@/health/helpers';
import * as constants from '@/health/constants';

describe('withTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves when operation completes before timeout', async () => {
    const operation = Promise.resolve('success');
    const promise = withTimeout(operation, constants.PROBE_CHECK_TIMEOUT_MS);

    const result = await promise;

    expect(result).toBe('success');
  });

  it('rejects when operation exceeds timeout', async () => {
    const operation = new Promise((resolve) => setTimeout(resolve, 10000));
    const promise = withTimeout(operation, constants.PROBE_CHECK_TIMEOUT_MS);

    jest.advanceTimersByTime(constants.PROBE_CHECK_TIMEOUT_MS);

    await expect(promise).rejects.toThrow(
      `Timeout after ${constants.PROBE_CHECK_TIMEOUT_MS}ms`,
    );
  });

  it('clears timeout when operation completes', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const operation = Promise.resolve('done');

    await withTimeout(operation, constants.PROBE_CHECK_TIMEOUT_MS);

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('clears timeout even when operation rejects', async () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const operation = Promise.reject(new Error('failed'));

    await withTimeout(operation, constants.PROBE_CHECK_TIMEOUT_MS).catch(
      () => {},
    );

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
