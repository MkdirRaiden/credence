// __tests__/unit/bootstrap/log-startup.spec.ts
import { logStartup } from '@/bootstrap/helpers/startup-log';
import { LoggerService } from '@/logger/logger.service';
import type { INestApplication } from '@nestjs/common';

describe('logStartup', () => {
  let mockApp: jest.Mocked<INestApplication>;
  let mockLogger: jest.Mocked<LoggerService>;

  beforeEach(() => {
    mockLogger = { log: jest.fn() } as any;
    mockApp = {
      get: jest.fn().mockReturnValue(mockLogger),
    } as any;
  });

  it('✅ logs full base URL when prefix is provided', () => {
    logStartup(mockApp, 'localhost', 3000, 'api/v1');
    expect(mockApp.get).toHaveBeenCalledWith(LoggerService);
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Server running on http://localhost:3000/api/v1',
      'Bootstrap',
    );
  });

  it('✅ logs without prefix when none provided', () => {
    logStartup(mockApp, '127.0.0.1', 4000);
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Server running on http://127.0.0.1:4000',
      'Bootstrap',
    );
  });

  it('✅ trims slashes in prefix', () => {
    logStartup(mockApp, 'localhost', 8080, '/v2/');
    expect(mockLogger.log).toHaveBeenCalledWith(
      'Server running on http://localhost:8080/v2',
      'Bootstrap',
    );
  });
});
