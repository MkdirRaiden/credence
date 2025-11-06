// __tests__/unit/config/factory/configuration.spec.ts
import { configuration } from '@/config/factory/configuration';
import { validEnv } from '../__fixtures__/env.fixtures';
import { APP_NAME, APP_VERSION } from '@/config/constants';


describe('configuration', () => {
  const originalEnv = process.env;


  beforeEach(() => {
    process.env = { ...originalEnv, ...validEnv };
  });


  afterEach(() => {
    process.env = originalEnv;
  });


  it('returns typed AppConfig object', () => {
    const config = configuration();


    expect(config).toHaveProperty('app');
    expect(config).toHaveProperty('server');
    expect(config).toHaveProperty('database');
    expect(config).toHaveProperty('jwt');
  });


  it('sets app metadata from env', () => {
    process.env.APP_NAME = 'TestApp';
    process.env.APP_VERSION = '2.0.0';


    const config = configuration();


    expect(config.app.appName).toBe('TestApp');
    expect(config.app.appVersion).toBe('2.0.0');
  });


  it('uses defaults when app metadata missing', () => {
    delete process.env.APP_NAME;
    delete process.env.APP_VERSION;


    const config = configuration();


    expect(config.app.appName).toBe(APP_NAME);
    expect(config.app.appVersion).toBe(APP_VERSION);
  });


  it('parses PORT as number', () => {
    process.env.PORT = '8080';


    const config = configuration();


    expect(config.server.port).toBe(8080);
    expect(typeof config.server.port).toBe('number');
  });


  it('splits ALLOWED_ORIGINS from comma-separated string', () => {
    process.env.ALLOWED_ORIGINS = 'http://localhost:3000,https://example.com';


    const config = configuration();


    expect(config.server.allowedOrigins).toEqual([
      'http://localhost:3000',
      'https://example.com',
    ]);
  });


  it('sets database config from env', () => {
    const config = configuration();


    expect(config.database.url).toBe(validEnv.DATABASE_URL);
    expect(config.database.maxRetries).toBeDefined();
    expect(config.database.healthCheckIntervalMs).toBeDefined();
  });


  it('sets jwt config from env', () => {
    const config = configuration();


    expect(config.jwt.jwtSecret).toBe(validEnv.JWT_SECRET);
    expect(config.jwt.jwtRefreshSecret).toBe(validEnv.JWT_REFRESH_SECRET);
    expect(config.jwt.jwtExpiration).toBeDefined();
  });


  it('uses default ALLOWED_ORIGINS when env missing', () => {
    delete process.env.ALLOWED_ORIGINS;


    const config = configuration();


    expect(config.server.allowedOrigins).toEqual(expect.any(Array));
    expect(config.server.allowedOrigins.length).toBeGreaterThan(0);
  });
});
