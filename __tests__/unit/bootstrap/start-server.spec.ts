// __tests__/unit/bootstrap/helpers/start-server.spec.ts
import { startServerAndLog } from '@/bootstrap/helpers';
import { LoggerService } from '@/logger/services';
import type { AppConfig } from '@/common/interfaces';
import type { INestApplication } from '@nestjs/common';


describe('startServerAndLog', () => {
  let mockApp: jest.Mocked<INestApplication>;
  let mockLogger: jest.Mocked<LoggerService>;


  beforeEach(() => {
    mockLogger = { log: jest.fn() } as any;
    mockApp = { listen: jest.fn().mockResolvedValue(undefined) } as any;
  });


  it('calls app.listen with port', async () => {
    const config: AppConfig['server'] = {
      port: 3000,
      host: 'localhost',
      globalPrefix: 'api/v1',
      nodeEnv: 'development',
      allowedOrigins: [],
      excludePrefixArray: [],
    };


    await startServerAndLog(config, mockApp, mockLogger);


    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });


  it('logs full URL with prefix in development', async () => {
    const config: AppConfig['server'] = {
      port: 3000,
      host: 'localhost',
      globalPrefix: 'api/v1',
      nodeEnv: 'development',
      allowedOrigins: [],
      excludePrefixArray: [],
    };


    await startServerAndLog(config, mockApp, mockLogger);


    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on http://localhost:3000/api/v1 [development]',
      'Bootstrap',
    );
  });


  it('logs URL without prefix when empty', async () => {
    const config: AppConfig['server'] = {
      port: 4000,
      host: 'localhost',
      globalPrefix: '',
      nodeEnv: 'test',
      allowedOrigins: [],
      excludePrefixArray: [],
    };


    await startServerAndLog(config, mockApp, mockLogger);


    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on http://localhost:4000 [test]',
      'Bootstrap',
    );
  });


  it('uses https protocol in production', async () => {
    const config: AppConfig['server'] = {
      port: 5000,
      host: 'localhost',
      globalPrefix: 'api/v1',
      nodeEnv: 'production',
      allowedOrigins: [],
      excludePrefixArray: [],
    };


    await startServerAndLog(config, mockApp, mockLogger);


    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on https://localhost:5000/api/v1 [production]',
      'Bootstrap',
    );
  });


  it('trims slashes from prefix', async () => {
    const config: AppConfig['server'] = {
      port: 5000,
      host: 'localhost',
      globalPrefix: '/api/v1/',
      nodeEnv: 'production',
      allowedOrigins: [],
      excludePrefixArray: [],
    };


    await startServerAndLog(config, mockApp, mockLogger);


    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on https://localhost:5000/api/v1 [production]',
      'Bootstrap',
    );
  });
});
