// __tests__/unit/common/utils/async-storage.spec.ts
import { requestContext } from '@/common/utils';


describe('Request Context (AsyncLocalStorage)', () => {
  it('stores and retrieves request context', () => {
    const contextData = { requestId: 'req_123' };

    requestContext.run(contextData, () => {
      const stored = requestContext.getStore();
      expect(stored).toEqual(contextData);
      expect(stored?.requestId).toBe('req_123');
    });
  });

  it('returns undefined outside of context.run', () => {
    const stored = requestContext.getStore();
    expect(stored).toBeUndefined();
  });

  it('preserves context across nested async operations', async () => {
    const contextData = { requestId: 'req_456' };

    await new Promise<void>((resolve) => {
      requestContext.run(contextData, async () => {
        await new Promise((innerResolve) => setTimeout(innerResolve, 10));

        const stored = requestContext.getStore();
        expect(stored?.requestId).toBe('req_456');
        resolve();
      });
    });
  });

  it('isolates context between concurrent runs', async () => {
    const results: (string | undefined)[] = [];

    await Promise.all([
      new Promise<void>((resolve) => {
        requestContext.run({ requestId: 'req_1' }, () => {
          setTimeout(() => {
            results.push(requestContext.getStore()?.requestId);
            resolve();
          }, 10);
        });
      }),
      new Promise<void>((resolve) => {
        requestContext.run({ requestId: 'req_2' }, () => {
          setTimeout(() => {
            results.push(requestContext.getStore()?.requestId);
            resolve();
          }, 5);
        });
      }),
    ]);

    expect(results).toContain('req_1');
    expect(results).toContain('req_2');
    expect(results.length).toBe(2);
  });
});
