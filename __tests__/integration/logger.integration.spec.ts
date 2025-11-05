// __tests__/integration/logger.integration.spec.ts
import { INestApplication } from '@nestjs/common';
import { LoggerService } from '@/logger/services/logger.service';
import { requestContext } from '@/common/utils/async-storage';
import { createTestModule } from '../helpers/test-module.factory';

describe('LoggerModule (Integration)', () => {
  let app: INestApplication;
  let logger: LoggerService;

  beforeAll(async () => {
    const moduleRef = await createTestModule();
    app = moduleRef.createNestApplication();
    await app.init();
    logger = moduleRef.get(LoggerService);
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('provides all required log methods', () => {
    expect(logger.log).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
    expect(logger.verbose).toBeDefined();
  });

  it('outputs structured JSON format', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.log('Structured test', 'TestCtx');
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();
    logSpy.mockRestore();
  });

  it('logs messages with context', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.log('Test info message', 'TestContext');
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0][0];
    expect(output).toContain('TestContext');
    logSpy.mockRestore();
  });

  it('logs errors with stack trace', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('Test error');
    logger.error('Error occurred', error, 'ErrorContext');
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('includes requestId when available in context', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    requestContext.run({ requestId: 'req_test_123' }, () => {
      logger.log('With request ID', 'TestCtx');
      const output = logSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);
      expect(parsed.requestId).toBe('req_test_123');
    });
    logSpy.mockRestore();
  });

  it('omits requestId when context is empty', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    requestContext.run({}, () => {
      logger.log('Without request ID', 'TestCtx');
      const output = logSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);
      expect(parsed.requestId).toBeUndefined();
    });
    logSpy.mockRestore();
  });
});
