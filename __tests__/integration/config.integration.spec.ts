// __tests__/integration/config.integration.spec.ts
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { closeTestApp, createTestModule } from '../helpers/test-module.factory';
import type { AppConfig } from '@/common/interfaces/app-config.interface';

describe('ConfigModule (Integration)', () => {
  let app: INestApplication;
  let configService: ConfigService<AppConfig>;

  beforeAll(async () => {
    const moduleRef = await createTestModule();
    app = moduleRef.createNestApplication();
    await app.init();
    configService = moduleRef.get(ConfigService);
  });

  afterAll(async () => {
    if (app) await closeTestApp(app);
  });

  it('loads all required environment variables', () => {
    const keys: (keyof AppConfig)[] = [
      'nodeEnv',
      'port',
      'appName',
      'appVersion',
      'host',
      'globalPrefix',
      'database',
      'allowedOrigins',
      'jwtSecret',
      'jwtRefreshSecret',
    ];

    keys.forEach((key) => {
      const value = configService.get(key);
      expect(value).toBeDefined();
    });
  });

  it('loads JWT secrets from environment', () => {
    const jwtSecret = configService.get('jwtSecret');
    const jwtRefreshSecret = configService.get('jwtRefreshSecret');

    expect(jwtSecret).toBeDefined();
    expect(jwtRefreshSecret).toBeDefined();
    expect(jwtSecret).not.toBe(jwtRefreshSecret);
  });

  it('database configuration is valid', () => {
    const database = configService.get('database');
    expect(database).toBeDefined();
    expect(typeof database).toBe('object');
    expect(database).toHaveProperty('url');
    expect((database as any).url).toMatch(/^postgres/);
  });

  it('allowed origins are configured', () => {
    const allowedOrigins = configService.get('allowedOrigins');
    expect(allowedOrigins).toBeDefined();
    expect(Array.isArray(allowedOrigins)).toBe(true);
  });
});
