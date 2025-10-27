// __tests__/unit/config/config.schema.spec.ts
import { configValidationSchema } from '@/config/config.schema';
import { validEnv, invalidEnv, partialEnv } from './__fixtures__/env.fixtures';
import { DEFAULT_ALLOWED_ORIGINS } from '@/common/constants';

describe('configValidationSchema', () => {
  it('✅ validates valid environment variables', () => {
    const { error, value } = configValidationSchema.validate(validEnv);
    expect(error).toBeUndefined();
    expect(value.PORT).toBe(4000);
    expect(value.NODE_ENV).toBe(validEnv.NODE_ENV);
    expect(value.ALLOWED_ORIGINS).toBe(validEnv.ALLOWED_ORIGINS); // still string here
  });

  it('🚫 rejects invalid environment variables', () => {
    const { error } = configValidationSchema.validate(invalidEnv);
    expect(error).toBeDefined();
    expect(error?.message).toContain('NODE_ENV');
  });

  // 🆕 NEW TEST — ensures non-PostgreSQL URLs fail validation
  it('🚫 rejects non-PostgreSQL database URLs', () => {
    const { error } = configValidationSchema.validate({
      ...validEnv,
      DATABASE_URL: 'mysql://localhost:3306/db',
    });
    expect(error).toBeDefined();
    // Optionally assert for the pattern label you defined
    expect(error?.message).toContain('PostgreSQL connection string');
  });

  it('🧩 applies default values when not provided', () => {
    const { value } = configValidationSchema.validate(partialEnv);
    expect(value.PORT).toBeDefined();
    expect(value.NODE_ENV).toBeDefined();
    expect(value.ALLOWED_ORIGINS).toBe(DEFAULT_ALLOWED_ORIGINS.join(',')); // string default
  });
});
