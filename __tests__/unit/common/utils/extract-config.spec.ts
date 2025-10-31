// __tests__/unit/common/utils/extract-config.spec.ts
import { extractConfig } from '@/common/utils/extract-config';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '@/common/interfaces/app-config.interface';

describe('extractConfig utility', () => {
  const createMockConfigService = (mockValues: Partial<AppConfig>) => {
    return {
      get: jest.fn((key: keyof AppConfig) => mockValues[key]),
    } as unknown as ConfigService<AppConfig, true>;
  };

  it('extracts single, multiple, and empty keys with infer:true', () => {
    // Single key
    const singleMock = createMockConfigService({ nodeEnv: 'test', port: 3000 });
    const single = extractConfig(singleMock, ['nodeEnv'] as const);
    expect(single).toEqual({ nodeEnv: 'test' });
    expect(singleMock.get).toHaveBeenCalledWith('nodeEnv', { infer: true });

    // Multiple keys
    const multiMock = createMockConfigService({
      nodeEnv: 'production',
      port: 5000,
      host: 'localhost',
    });
    const multi = extractConfig(multiMock, [
      'nodeEnv',
      'port',
      'host',
    ] as const);
    expect(multi).toEqual({
      nodeEnv: 'production',
      port: 5000,
      host: 'localhost',
    });
    expect(multiMock.get).toHaveBeenCalledTimes(3);

    // Empty keys
    const emptyMock = createMockConfigService({ nodeEnv: 'test' });
    const empty = extractConfig(emptyMock, [] as const);
    expect(empty).toEqual({});
    expect(emptyMock.get).not.toHaveBeenCalled();
  });

  it('extracts complex objects and handles undefined values', () => {
    // Database object
    const dbMock = createMockConfigService({
      database: { url: 'postgresql://localhost:5432/test' },
    });
    const db = extractConfig(dbMock, ['database'] as const);
    expect(db).toEqual({
      database: { url: 'postgresql://localhost:5432/test' },
    });

    // Undefined values
    const undefinedMock = createMockConfigService({
      nodeEnv: undefined,
      port: undefined,
    });
    const undef = extractConfig(undefinedMock, ['nodeEnv', 'port'] as const);
    expect(undef).toEqual({ nodeEnv: undefined, port: undefined });
  });
});
