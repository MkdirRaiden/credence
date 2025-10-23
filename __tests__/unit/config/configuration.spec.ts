// __tests__/unit/config/configuration.schema.spec.ts
import configuration from '@/config/configuration';

describe('configuration.ts', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('✅ returns default values when env not set', () => {
    delete process.env.PORT;
    const result = configuration();
    expect(result.port).toBeGreaterThan(0);
  });

  it('✅ parses comma-separated allowed origins', () => {
    process.env.ALLOWED_ORIGINS = 'http://one.com,https://two.com';
    const result = configuration();
    expect(result.allowedOrigins).toEqual([
      'http://one.com',
      'https://two.com',
    ]);
  });
});
