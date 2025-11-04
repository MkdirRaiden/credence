// __tests__/unit/health/helpers/timeout.helper.spec.ts
import { createTimeoutPromise } from '@/health/helpers/timeout.helper';

describe('createTimeoutPromise', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('returns object with id and promise', () => {
    const result = createTimeoutPromise(5000);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('promise');
    expect(result.id).toBeDefined();
    expect(result.promise).toBeInstanceOf(Promise);

    clearTimeout(result.id);
  });

  it('promise rejects after timeout', async () => {
    jest.useFakeTimers();
    const { promise } = createTimeoutPromise(1000);

    const rejectPromise = expect(promise).rejects.toThrow(
      'Timeout after 1000ms',
    );

    jest.advanceTimersByTime(1000);
    await rejectPromise;
    jest.useRealTimers();
  });

  it('timeout can be cleared with clearTimeout', async () => {
    jest.useFakeTimers();
    const { id, promise } = createTimeoutPromise(1000);

    clearTimeout(id);
    jest.advanceTimersByTime(1000);

    // Promise should still be pending (not rejected)
    let settled = false;
    promise.catch(() => {
      settled = true;
    });
    jest.runAllTimers();

    expect(settled).toBe(false);
    jest.useRealTimers();
  });
});
