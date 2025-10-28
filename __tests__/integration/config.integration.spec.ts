// __tests__/integration/config.integration.spec.ts
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@/config/config.module';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces/app-config.interface';

describe('ConfigModule (Integration)', () => {
  let configService: ConfigService<AppConfig>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();

    configService = moduleRef.get(ConfigService);
  });

  describe('Environment Loading', () => {
    it('loads appName from config', () => {
      const appName = configService.get('appName');
      expect(appName).toBeDefined();
      expect(typeof appName).toBe('string');
    });

    it('loads appVersion from config', () => {
      const appVersion = configService.get('appVersion');
      expect(appVersion).toBeDefined();
      expect(typeof appVersion).toBe('string');
    });

    it('loads nodeEnv from config', () => {
      const nodeEnv = configService.get('nodeEnv');
      expect(nodeEnv).toBe('test');
    });

    it('loads port from config', () => {
      const port = configService.get('port');
      expect(port).toBeDefined();
      expect(typeof port).toBe('number');
    });

    it('loads host from config', () => {
      const host = configService.get('host');
      expect(host).toBeDefined();
      expect(typeof host).toBe('string');
    });

    it('loads globalPrefix from config', () => {
      const globalPrefix = configService.get('globalPrefix');
      expect(globalPrefix).toBeDefined();
      expect(typeof globalPrefix).toBe('string');
    });

    it('loads database configuration', () => {
      const database = configService.get('database');
      expect(database).toBeDefined();
      expect(database?.url).toBeDefined();
      expect(typeof database?.url).toBe('string');
    });

    it('loads allowedOrigins', () => {
      const allowedOrigins = configService.get('allowedOrigins');
      expect(allowedOrigins).toBeDefined();
      expect(Array.isArray(allowedOrigins)).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('getOrThrow returns value or throws', () => {
      expect(() => configService.getOrThrow('appName')).not.toThrow();
      expect(configService.getOrThrow('appName')).toBeDefined();
    });

    it('getOrThrow throws for missing required config', () => {
      expect(() => 
        configService.getOrThrow('nonExistentKey' as any)
      ).toThrow();
    });
  });

  describe('Nested Configuration', () => {
    it('accesses nested database url', () => {
      const database = configService.get('database');
      expect(database?.url).toBeDefined();
      expect(typeof database?.url).toBe('string');
      expect(database?.url).toContain('postgresql');
    });
  });

  describe('Complete Config Object', () => {
    it('has all required properties', () => {
      const config = {
        nodeEnv: configService.get('nodeEnv'),
        port: configService.get('port'),
        appName: configService.get('appName'),
        appVersion: configService.get('appVersion'),
        host: configService.get('host'),
        globalPrefix: configService.get('globalPrefix'),
        database: configService.get('database'),
        allowedOrigins: configService.get('allowedOrigins'),
      };

      expect(config.nodeEnv).toBeDefined();
      expect(config.port).toBeDefined();
      expect(config.appName).toBeDefined();
      expect(config.appVersion).toBeDefined();
      expect(config.host).toBeDefined();
      expect(config.globalPrefix).toBeDefined();
      expect(config.database).toBeDefined();
      expect(config.allowedOrigins).toBeDefined();
    });
  });
});
