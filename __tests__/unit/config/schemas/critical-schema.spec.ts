// __tests__/unit/config/schemas/critical-schema.spec.ts
import { getCriticalSchema } from '@/config/schemas';
import { CRITICAL_ENV_VARS } from '@/config/constants';
import { validEnv } from '../__fixtures__/env.fixtures';

describe('getCriticalSchema', () => {
  it('returns Joi ObjectSchema', () => {
    const schema = getCriticalSchema();
    expect(schema).toHaveProperty('validateAsync');
  });

  it('extracts all critical fields', async () => {
    const schema = getCriticalSchema();
    const result = await schema.validateAsync(validEnv);

    CRITICAL_ENV_VARS.forEach((field) => {
      expect(result).toHaveProperty(field);
    });
  });

  it('throws on invalid critical field', async () => {
    const schema = getCriticalSchema();
    const invalidEnv = { ...validEnv, JWT_SECRET: '' };

    await expect(schema.validateAsync(invalidEnv)).rejects.toThrow();
  });

  it('allows unknown fields (unknown: true)', async () => {
    const schema = getCriticalSchema();
    const envWithExtra = { ...validEnv, UNKNOWN_FIELD: 'value' };

    await expect(schema.validateAsync(envWithExtra)).resolves.toBeDefined();
  });

  it('applies external validators to critical fields', async () => {
    const schema = getCriticalSchema();

    // Invalid JWT_SECRET (weak pattern)
    const weakSecret = { ...validEnv, JWT_SECRET: 'password' + 'a'.repeat(24) };
    await expect(schema.validateAsync(weakSecret)).rejects.toThrow();
  });
});
