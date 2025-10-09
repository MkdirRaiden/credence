import configuration from '@/config/configuration';
import {
  APP_NAME,
  APP_VERSION,
  DEFAULT_ENV,
  DEFAULT_PORT,
  DEFAULT_ALLOWED_ORIGINS,
} from '@/common/constants';

describe('configuration factory', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should use environment variables if provided', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '5000';
    process.env.APP_NAME = 'MyApp';
    process.env.APP_VERSION = '2.0';
    process.env.ALLOWED_ORIGINS = 'http://a.com,http://b.com';
    process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db';

    const config = configuration();

    expect(config.nodeEnv).toBe('test');
    expect(config.port).toBe(5000);
    expect(config.appName).toBe('MyApp');
    expect(config.appVersion).toBe('2.0');
    expect(config.database.url).toBe('postgres://user:pass@localhost:5432/db');
    expect(config.allowedOrigins).toEqual(['http://a.com', 'http://b.com']);
  });

  it('should use default values if environment variables are missing', () => {
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.APP_NAME;
    delete process.env.APP_VERSION;
    delete process.env.ALLOWED_ORIGINS;
    process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db';

    const config = configuration();

    expect(config.nodeEnv).toBe(DEFAULT_ENV);
    expect(config.port).toBe(DEFAULT_PORT);
    expect(config.appName).toBe(APP_NAME);
    expect(config.appVersion).toBe(APP_VERSION);
    expect(config.database.url).toBe('postgres://user:pass@localhost:5432/db');
    expect(config.allowedOrigins).toEqual(DEFAULT_ALLOWED_ORIGINS);
  });
});
