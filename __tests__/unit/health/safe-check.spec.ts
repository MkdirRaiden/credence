// __tests__/unit/health/safe-check.spec.ts
import { safeCheck } from '@/health/helpers';

describe('safeCheck', () => {
  const probeName = 'test-probe';

  it('returns up status when check succeeds', async () => {
    const checkFn = jest.fn().mockResolvedValue(undefined);

    const result = await safeCheck(probeName, checkFn);

    expect(result).toEqual({ name: probeName, status: 'up' });
    expect(checkFn).toHaveBeenCalledTimes(1);
  });

  it('returns down status with error message when check throws Error', async () => {
    const error = new Error('Connection failed');
    const checkFn = jest.fn().mockRejectedValue(error);

    const result = await safeCheck(probeName, checkFn);

    expect(result).toEqual({
      name: probeName,
      status: 'down',
      message: 'Connection failed',
    });
  });

  it('returns down status with generic message for non-Error throws', async () => {
    const checkFn = jest.fn().mockRejectedValue('string error');

    const result = await safeCheck(probeName, checkFn);

    expect(result).toEqual({
      name: probeName,
      status: 'down',
      message: 'Unknown error',
    });
  });

  it('handles synchronous errors', async () => {
    const checkFn = jest.fn().mockImplementation(() => {
      throw new Error('Sync error');
    });

    const result = await safeCheck(probeName, checkFn);

    expect(result).toEqual({
      name: probeName,
      status: 'down',
      message: 'Sync error',
    });
  });
});
