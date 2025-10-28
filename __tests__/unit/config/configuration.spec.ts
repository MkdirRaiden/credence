// __tests__/unit/config/configuration.spec.ts
import configuration from '@/config/configuration';
import { DEFAULT_ALLOWED_ORIGINS } from '@/common/constants';
import { validEnv, partialEnv } from './__fixtures__/env.fixtures';

describe('configuration.ts', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    // Ensure DATABASE_URL exists for safe test
    process.env.DATABASE_URL =
      process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/db';
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('returns correct values with validEnv', () => {
    process.env = { ...validEnv };
    const result = configuration();

    expect(result.nodeEnv).toBe(validEnv.NODE_ENV);
    expect(result.port).toBe(Number(validEnv.PORT));
    expect(result.database.url).toBe(validEnv.DATABASE_URL);
    expect(result.allowedOrigins).toEqual([
      'http://localhost:3000',
      'https://credence.app',
    ]);
    expect(result.appName).toBe(validEnv.APP_NAME);
    expect(result.appVersion).toBe(validEnv.APP_VERSION);
  });

  it('applies defaults when optional env vars are missing (partialEnv)', () => {
    process.env = { ...partialEnv };
    const result = configuration();

    expect(result.port).toBeGreaterThan(0); // default PORT
    expect(result.nodeEnv).toBeDefined(); // default NODE_ENV
    expect(result.appName).toBeDefined(); // default APP_NAME
    expect(result.allowedOrigins).toEqual(DEFAULT_ALLOWED_ORIGINS); // fallback
    expect(result.database.url).toBe(partialEnv.DATABASE_URL);
  });

  it('parses comma-separated ALLOWED_ORIGINS correctly', () => {
    process.env.ALLOWED_ORIGINS = 'http://one.com,https://two.com';
    const result = configuration();
    expect(result.allowedOrigins).toEqual([
      'http://one.com',
      'https://two.com',
    ]);
  });

  it('falls back to DEFAULT_ALLOWED_ORIGINS when ALLOWED_ORIGINS is empty', () => {
    delete process.env.ALLOWED_ORIGINS;
    const result1 = configuration();
    expect(result1.allowedOrigins).toEqual(DEFAULT_ALLOWED_ORIGINS);

    process.env.ALLOWED_ORIGINS = '';
    const result2 = configuration();
    expect(result2.allowedOrigins).toEqual(DEFAULT_ALLOWED_ORIGINS);
  });

  it('correctly parses PORT as number', () => {
    process.env.PORT = '5000';
    const result = configuration();
    expect(result.port).toBe(5000);
  });

  it('sets database.url from env', () => {
    process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/mydb';
    const result = configuration();
    expect(result.database.url).toBe(
      'postgres://user:pass@localhost:5432/mydb',
    );
  });
});
