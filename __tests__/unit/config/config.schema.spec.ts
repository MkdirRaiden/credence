// __tests__/unit/config/config.schema.spec.ts
import { configValidationSchema } from '@/config/config.schema';
import { validEnv, invalidEnv, partialEnv } from './__fixtures__/env.fixtures';

describe('configValidationSchema', () => {
  it('✅ validates valid environment variables', () => {
    const { error, value } = configValidationSchema.validate(validEnv);
    expect(error).toBeUndefined();
    expect(value.PORT).toBe(4000);
  });

  it('🚫 rejects invalid environment variables', () => {
    const { error } = configValidationSchema.validate(invalidEnv);
    expect(error).toBeDefined();
    expect(error?.message).toContain('NODE_ENV');
  });

  it('🧩 applies default values when not provided', () => {
    const { value } = configValidationSchema.validate(partialEnv);
    expect(value.PORT).toBeDefined();
    expect(value.NODE_ENV).toBeDefined();
  });
});
