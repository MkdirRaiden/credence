// __tests__/integration/config.integration.spec.ts
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces/app-config.interface';
import { createTestModule } from './__helpers__/test-module.factory';

describe('ConfigModule (Integration)', () => {
  let configService: ConfigService<AppConfig>;

  beforeAll(async () => {
    const moduleRef = await createTestModule();
    configService = moduleRef.get(ConfigService);
  });

  it('loads all required config properties', () => {
    const requiredKeys: (keyof AppConfig)[] = [
      'nodeEnv',
      'port',
      'appName',
      'appVersion',
      'host',
      'globalPrefix',
      'database',
      'allowedOrigins',
    ];

    requiredKeys.forEach((key) => {
      const value = configService.get(key);
      expect(value).toBeDefined();
    });
  });

  it('loads correct types for config values', () => {
    expect(typeof configService.get('nodeEnv')).toBe('string');
    expect(typeof configService.get('port')).toBe('number');
    expect(Array.isArray(configService.get('allowedOrigins'))).toBe(true);
    expect(configService.get('database')?.url).toContain('postgresql');
  });

  it('uses test environment', () => {
    expect(configService.get('nodeEnv')).toBe('test');
  });

  it('throws for missing required config', () => {
    expect(() => configService.getOrThrow('nonExistentKey' as any)).toThrow();
  });
});
