// __tests__/unit/common/utils/extract-config.spec.ts
import { extractConfig } from '@/common/utils/extract-config';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '@/common/interfaces/app-config.interface';

describe('extractConfig utility', () => {
  // Utility factory for ConfigService mock
  const createMockConfigService = (mockValues: Partial<AppConfig>) => {
    return {
      get: jest.fn((key: keyof AppConfig, options?: { infer: boolean }) => {
        if (options?.infer) {
          return mockValues[key];
        }
        return mockValues[key];
      }),
      getOrThrow: jest.fn(),
    } as unknown as ConfigService<AppConfig, true>;
  };

  it('extracts a single config key with infer:true', () => {
    const mockConfig = createMockConfigService({
      nodeEnv: 'test',
      port: 3000,
    });

    const result = extractConfig(mockConfig, ['nodeEnv'] as const);

    expect(result).toEqual({ nodeEnv: 'test' });
    expect(mockConfig.get).toHaveBeenCalledWith('nodeEnv', { infer: true });
    expect(mockConfig.get).toHaveBeenCalledTimes(1);
  });

  it('extracts multiple config keys with infer:true', () => {
    const mockConfig = createMockConfigService({
      nodeEnv: 'production',
      port: 5000,
      host: 'localhost',
      globalPrefix: 'api/v1',
      allowedOrigins: ['http://localhost:3000'],
    });

    const result = extractConfig(mockConfig, [
      'nodeEnv',
      'port',
      'host',
      'globalPrefix',
      'allowedOrigins',
    ] as const);

    expect(result).toEqual({
      nodeEnv: 'production',
      port: 5000,
      host: 'localhost',
      globalPrefix: 'api/v1',
      allowedOrigins: ['http://localhost:3000'],
    });
    expect(mockConfig.get).toHaveBeenCalledTimes(5);
    expect(mockConfig.get).toHaveBeenCalledWith('nodeEnv', { infer: true });
    expect(mockConfig.get).toHaveBeenCalledWith('port', { infer: true });
    expect(mockConfig.get).toHaveBeenCalledWith('host', { infer: true });
    expect(mockConfig.get).toHaveBeenCalledWith('globalPrefix', { infer: true });
    expect(mockConfig.get).toHaveBeenCalledWith('allowedOrigins', { infer: true });
  });

  it('returns empty object when extracting empty keys array', () => {
    const mockConfig = createMockConfigService({
      nodeEnv: 'test',
    });

    const result = extractConfig(mockConfig, [] as const);

    expect(result).toEqual({});
    expect(mockConfig.get).not.toHaveBeenCalled();
  });

  it('extracts database config object correctly', () => {
    const mockConfig = createMockConfigService({
      database: { url: 'postgresql://localhost:5432/test' },
    });

    const result = extractConfig(mockConfig, ['database'] as const);

    expect(result).toEqual({
      database: { url: 'postgresql://localhost:5432/test' },
    });
    expect(mockConfig.get).toHaveBeenCalledWith('database', { infer: true });
  });

  it('handles undefined values from config', () => {
    const mockConfig = createMockConfigService({
      nodeEnv: undefined,
      port: undefined,
    });

    const result = extractConfig(mockConfig, ['nodeEnv', 'port'] as const);

    expect(result).toEqual({
      nodeEnv: undefined,
      port: undefined,
    });
    expect(mockConfig.get).toHaveBeenCalledTimes(2);
  });
});
