// __tests__/unit/bootstrap/server-info.spec.ts
import { getServerInfo } from '@/bootstrap/helpers/server-info';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { GLOBAL_PREFIX, PORT, HOST } from '@/common/constants';

describe('getServerInfo', () => {
  let app: Partial<INestApplication>;
  let configService: Partial<ConfigService>;

  beforeEach(() => {
    configService = {
      get: jest.fn(),
    };

    app = {
      get: jest.fn().mockImplementation((token: any) => {
        if (token === ConfigService) return configService;
        return undefined;
      }),
    };
  });

  it('✅ returns config values when provided', () => {
    (configService.get as jest.Mock).mockImplementation((key: string, defaultValue: any) => {
      if (key === 'port') return 5000;
      if (key === 'globalPrefix') return 'api';
      if (key === 'host') return 'localhost';
      return defaultValue;
    });

    const info = getServerInfo(app as INestApplication);

    expect(info.port).toBe(5000);
    expect(info.prefix).toBe('api');
    expect(info.host).toBe('localhost');
  });

  it('✅ falls back to defaults if config not set', () => {
    (configService.get as jest.Mock).mockImplementation((_: string, defaultValue: any) => defaultValue);

    const info = getServerInfo(app as INestApplication);

    expect(info.port).toBe(PORT);
    expect(info.prefix).toBe(GLOBAL_PREFIX);
    expect(info.host).toBe(HOST);
  });
});
