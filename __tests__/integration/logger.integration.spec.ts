// __tests__/integration/logger.integration.spec.ts
import { INestApplication } from '@nestjs/common';
import { LoggerService } from '@/logger/logger.service';
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
});
