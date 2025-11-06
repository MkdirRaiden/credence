// __tests__/unit/config/config.schema.spec.ts
import { configValidationSchema } from '@/config/schemas/config.schema';
import { validEnv, invalidEnv, partialEnv } from './__fixtures__/env.fixtures';
import { DEFAULT_ALLOWED_ORIGINS } from '@/common/constants';

describe('configValidationSchema', () => {
  it('validates valid environment variables', () => {
    const { error, value } = configValidationSchema.validate(validEnv);
    expect(error).toBeUndefined();
    expect(value.PORT).toBe(4000);
    expect(value.NODE_ENV).toBe(validEnv.NODE_ENV);
    expect(value.JWT_SECRET).toBe(validEnv.JWT_SECRET);
    expect(value.JWT_REFRESH_SECRET).toBe(validEnv.JWT_REFRESH_SECRET);
  });

  it('rejects invalid environment variables', () => {
    const { error } = configValidationSchema.validate(invalidEnv);
    expect(error).toBeDefined();
    expect(error?.message).toContain('NODE_ENV');
  });

  it('rejects non-PostgreSQL database URLs', () => {
    const { error } = configValidationSchema.validate({
      ...validEnv,
      DATABASE_URL: 'mysql://localhost:3306/db',
    });
    expect(error).toBeDefined();
    expect(error?.message).toContain('PostgreSQL');
  });

  it('rejects empty JWT secrets', () => {
    const { error } = configValidationSchema.validate({
      ...validEnv,
      JWT_SECRET: '',
    });
    expect(error).toBeDefined();
  });

  it('rejects missing JWT fields', () => {
    const { JWT_SECRET, ...env } = validEnv;
    const { error } = configValidationSchema.validate(env);
    expect(error).toBeDefined();
  });

  it('applies default values when not provided', () => {
    const { value } = configValidationSchema.validate(partialEnv);
    expect(value.PORT).toBeDefined();
    expect(value.NODE_ENV).toBeDefined();
    expect(value.ALLOWED_ORIGINS).toBe(DEFAULT_ALLOWED_ORIGINS.join(','));
  });
});
