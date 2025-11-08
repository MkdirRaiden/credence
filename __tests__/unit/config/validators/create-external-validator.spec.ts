// __tests__/unit/config/validators/create-external-validator.spec.ts
import { createExternalValidator } from '@/config/validators';

describe('createExternalValidator', () => {
  it('returns async function', () => {
    const validator = createExternalValidator<string>((v: string) => v);
    expect(validator).toBeInstanceOf(Function);
  });

  it('calls validator and resolves with value on success', async () => {
    const mockValidator = jest.fn((value: string) => value);
    const validator = createExternalValidator<string>(mockValidator);

    const result = await validator('test-value');
    expect(result).toBe('test-value'); // Returns validated value, not undefined
    expect(mockValidator).toHaveBeenCalledWith('test-value');
  });

  it('catches validator error and throws with prefix', async () => {
    const mockValidator = jest.fn(() => {
      throw new Error('Invalid value');
    });
    const validator = createExternalValidator<string>(
      mockValidator,
      'JWT_SECRET',
    );

    await expect(validator('test')).rejects.toThrow(
      'JWT_SECRET: Invalid value',
    );
  });

  it('throws error without prefix if not provided', async () => {
    const mockValidator = jest.fn(() => {
      throw new Error('Invalid value');
    });
    const validator = createExternalValidator<string>(mockValidator);

    await expect(validator('test')).rejects.toThrow('Invalid value');
  });

  it('handles non-Error exceptions', async () => {
    const mockValidator = jest.fn(() => {
      throw 'string-error';
    });
    const validator = createExternalValidator<string>(mockValidator, 'CONFIG');

    await expect(validator('test')).rejects.toThrow(
      'CONFIG: Validation failed',
    );
  });

  it('passes value through to validator', async () => {
    const mockValidator = jest.fn((value: string) => value);
    const validator = createExternalValidator<string>(mockValidator);

    await validator('my-secret-value');

    expect(mockValidator).toHaveBeenCalledWith('my-secret-value');
  });
});
