// __tests__/unit/config/configuration.spec.ts
import configuration from '@/config/configuration';
import { DEFAULT_ALLOWED_ORIGINS } from '@/common/constants';
import { validEnv, partialEnv } from './__fixtures__/env.fixtures';

describe('configuration', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/db';
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('returns correct values with full env and applies defaults with partial', () => {
    // Test with validEnv
    process.env = { ...validEnv };
    const full = configuration();

    expect(full.nodeEnv).toBe(validEnv.NODE_ENV);
    expect(full.port).toBe(Number(validEnv.PORT));
    expect(full.database.url).toBe(validEnv.DATABASE_URL);
    expect(full.allowedOrigins).toEqual(['http://localhost:3000', 'https://credence.app']);

    // Test with partialEnv
    process.env = { ...partialEnv };
    const partial = configuration();

    expect(partial.port).toBeGreaterThan(0);
    expect(partial.nodeEnv).toBeDefined();
    expect(partial.allowedOrigins).toEqual(DEFAULT_ALLOWED_ORIGINS);
  });

  it('parses ALLOWED_ORIGINS correctly or falls back to defaults', () => {
    process.env.ALLOWED_ORIGINS = 'http://one.com,https://two.com';
    expect(configuration().allowedOrigins).toEqual(['http://one.com', 'https://two.com']);

    delete process.env.ALLOWED_ORIGINS;
    expect(configuration().allowedOrigins).toEqual(DEFAULT_ALLOWED_ORIGINS);

    process.env.ALLOWED_ORIGINS = '';
    expect(configuration().allowedOrigins).toEqual(DEFAULT_ALLOWED_ORIGINS);
  });
});
