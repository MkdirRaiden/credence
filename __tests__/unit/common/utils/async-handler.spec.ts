// __tests__/unit/common/utils/async-handler.spec.ts
import { asyncHandler } from '@/common/utils/async-handler';

describe('asyncHandler utility', () => {
  it('returns result from successful async operation', async () => {
    const operation = jest.fn().mockResolvedValue('success');

    const result = await asyncHandler(operation, {
      context: 'TestOperation',
    });

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalled();
  });

  it('throws error with context attached', async () => {
    const testError = new Error('Operation failed');
    const operation = jest.fn().mockRejectedValue(testError);

    try {
      await asyncHandler(operation, {
        context: 'DatabaseQuery',
      });
      fail('Should have thrown');
    } catch (err: any) {
      expect(err.message).toBe('Operation failed');
      expect(err.context).toEqual({
        operation: 'DatabaseQuery',
        originalMessage: 'Operation failed',
        stack: testError.stack,
      });
    }
  });

  it('uses errorFactory to transform error', async () => {
    const testError = new Error('DB connection failed');
    const operation = jest.fn().mockRejectedValue(testError);
    const errorFactory = jest.fn((err) => new Error(`Wrapped: ${err.message}`));

    try {
      await asyncHandler(operation, {
        context: 'Database',
        errorFactory,
      });
      fail('Should have thrown');
    } catch (err: any) {
      expect(errorFactory).toHaveBeenCalledWith(testError);
      expect(err.message).toBe('Wrapped: DB connection failed');
    }
  });

  it('handles non-Error throws', async () => {
    const operation = jest.fn().mockRejectedValue('String error');

    try {
      await asyncHandler(operation, {
        context: 'StringError',
      });
      fail('Should have thrown');
    } catch (err: any) {
      expect(err).toBeInstanceOf(Error);
      expect(err.message).toBe('String error');
      expect(err.context).toEqual({
        operation: 'StringError',
        originalMessage: 'String error',
        stack: err.stack,
      });
    }
  });

  it('preserves error with errorFactory and context', async () => {
    const testError = new Error('Original');
    const operation = jest.fn().mockRejectedValue(testError);
    const errorFactory = jest
      .fn()
      .mockImplementation((err) => new Error(`Custom: ${err.message}`));

    try {
      await asyncHandler(operation, {
        context: 'WithFactory',
        errorFactory,
      });
      fail('Should have thrown');
    } catch (err: any) {
      // Factory error is thrown, context is on original
      expect(err.message).toContain('Custom');
      expect(errorFactory).toHaveBeenCalled();
    }
  });
});
