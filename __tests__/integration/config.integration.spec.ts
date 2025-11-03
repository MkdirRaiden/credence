// __tests__/integration/config.integration.spec.ts
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTestModule } from './__helpers__/test-module.factory';
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
    if (app) await app.close();
  });

  it('loads all required config properties', () => {
    const keys: (keyof AppConfig)[] = [
      'nodeEnv', 'port', 'appName', 'appVersion', 'host',
      'globalPrefix', 'database', 'allowedOrigins', 'jwtSecret', 'jwtRefreshSecret',
    ];
    keys.forEach(key => expect(configService.get(key)).toBeDefined());
  });

  it('loads JWT secrets from environment', () => {
    const jwtSecret = configService.get('jwtSecret');
    const jwtRefreshSecret = configService.get('jwtRefreshSecret');
    expect(jwtSecret).toBeDefined();
    expect(jwtRefreshSecret).toBeDefined();
    expect(jwtSecret).not.toBe(jwtRefreshSecret);
  });
});
