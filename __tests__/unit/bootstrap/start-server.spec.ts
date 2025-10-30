// __tests__/unit/bootstrap/helpers/start-server.spec.ts
import { startServerAndLog } from '@/bootstrap/helpers';
import { LoggerService } from '@/logger/logger.service';
import { ServerConfig } from '@/bootstrap/bootstrap.interface';
import type { INestApplication } from '@nestjs/common';

describe('startServerAndLog', () => {
  let mockApp: jest.Mocked<INestApplication>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockLogger = { log: jest.fn() } as any;
    mockApp = { listen: jest.fn().mockResolvedValue(undefined) } as any;
  });

  it('logs full URL with prefix', async () => {
    const config: ServerConfig = {
      port: 3000,
      host: 'localhost',
      globalPrefix: 'api/v1',
      nodeEnv: 'development',
      allowedOrigins: [],
    };

    await startServerAndLog(config, mockApp, mockLogger);

    expect(mockApp.listen).toHaveBeenCalledWith(3000);
    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on http://localhost:3000/api/v1 [development]',
      'Bootstrap',
    );
  });

  it('logs URL without prefix when empty', async () => {
    const config: ServerConfig = {
      port: 4000,
      host: 'localhost',
      globalPrefix: '',
      nodeEnv: 'test',
      allowedOrigins: [],
    };

    await startServerAndLog(config, mockApp, mockLogger);

    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on http://localhost:4000 [test]',
      'Bootstrap',
    );
  });

  it('trims slashes from prefix', async () => {
    const config: ServerConfig = {
      port: 5000,
      host: 'localhost',
      globalPrefix: '/api/',
      nodeEnv: 'production',
      allowedOrigins: [],
    };

    await startServerAndLog(config, mockApp, mockLogger);

    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on https://localhost:5000/api [production]',
      'Bootstrap',
    );
  });

});
