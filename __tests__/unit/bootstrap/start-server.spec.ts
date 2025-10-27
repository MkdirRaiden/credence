// __tests__/unit/bootstrap/start-server.spec.ts
import { startServer } from '@/bootstrap/helpers';
import { getServerConfig } from '@/bootstrap/helpers/server-config';
import { LoggerService } from '@/logger/logger.service';
import type { INestApplication } from '@nestjs/common';

// ✅ Mock getServerConfig so we can control return values
jest.mock('@/bootstrap/helpers/server-config', () => ({
  getServerConfig: jest.fn(),
}));

describe('startServer', () => {
  let mockApp: jest.Mocked<INestApplication>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockLogger = { log: jest.fn() } as any;
    mockApp = {
      listen: jest.fn().mockResolvedValue(undefined),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('✅ logs full base URL when prefix is provided', async () => {
    (getServerConfig as jest.Mock).mockReturnValue({
      port: 3000,
      host: 'localhost',
      globalPrefix: 'api/v1',
      nodeEnv: 'development',
    });

    await startServer(mockApp, mockLogger);

    expect(mockApp.listen).toHaveBeenCalledWith(3000);
    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on http://localhost:3000/api/v1 [development]',
      'Bootstrap',
    );
  });

  it('✅ logs without prefix when none provided', async () => {
    (getServerConfig as jest.Mock).mockReturnValue({
      port: 4000,
      host: '127.0.0.1',
      globalPrefix: '',
      nodeEnv: 'test',
    });

    await startServer(mockApp, mockLogger);

    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on http://127.0.0.1:4000 [test]',
      'Bootstrap',
    );
  });

  it('✅ trims slashes in prefix', async () => {
    (getServerConfig as jest.Mock).mockReturnValue({
      port: 8080,
      host: 'localhost',
      globalPrefix: '/v2/',
      nodeEnv: 'production',
    });

    await startServer(mockApp, mockLogger);

    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on http://localhost:8080/v2 [production]',
      'Bootstrap',
    );
  });

  it('✅ omits env if not provided', async () => {
    (getServerConfig as jest.Mock).mockReturnValue({
      port: 8080,
      host: 'localhost',
      globalPrefix: '/v3/',
      nodeEnv: undefined,
    });

    await startServer(mockApp, mockLogger);

    expect(mockLogger.log).toHaveBeenCalledWith(
      '🚀 Server running on http://localhost:8080/v3 [undefined]',
      'Bootstrap',
    );
  });
});
