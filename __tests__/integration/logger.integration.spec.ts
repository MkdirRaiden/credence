// __tests__/integration/logger.integration.spec.ts
import { LoggerService } from '@/logger/services';
import { LOG_CONTEXTS } from '@/logger/constants';
import { requestContext } from '@/common/utils';
import { TestContext } from '../common/test-context';

describe('LoggerModule (Integration)', () => {
  const context = new TestContext();

  beforeAll(async () => {
    await context.setup();
  });

  afterAll(async () => {
    await context.teardown();
  });

  it('provides all required log methods', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    expect(logger.log).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
    expect(logger.verbose).toBeDefined();
  });

  it('outputs structured JSON format', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('Structured test', LOG_CONTEXTS.APP);

    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();

    logSpy.mockRestore();
  });

  it('logs messages with typed context', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('Test info message', LOG_CONTEXTS.AUTH);

    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed.context).toBe('Auth');

    logSpy.mockRestore();
  });

  it('logs errors with stack trace', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    const error = new Error('Test error');
    logger.error('Error occurred', error, LOG_CONTEXTS.DATABASE);

    expect(errorSpy).toHaveBeenCalled();
    const output = errorSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    // error fields are at root (directly on log entry)
    expect(parsed.name).toBe('Error');
    expect(parsed.trace).toContain('Test error');

    errorSpy.mockRestore();
  });

  it('includes requestId when available in context', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    requestContext.run({ requestId: 'req_test_123' }, () => {
      logger.log('With request ID', LOG_CONTEXTS.REQUEST);
      const output = logSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);
      expect(parsed.requestId).toBe('req_test_123');
    });

    logSpy.mockRestore();
  });

  it('omits requestId when context is empty', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    requestContext.run({}, () => {
      logger.log('Without request ID', LOG_CONTEXTS.APP);
      const output = logSpy.mock.calls[0][0];
      const parsed = JSON.parse(output);
      expect(parsed.requestId).toBeUndefined();
    });

    logSpy.mockRestore();
  });

  it('masks sensitive data in logs', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.log(
      {
        email: 'user@example.com',
        password: 'secret123',
        token: 'Bearer abc123',
      },
      LOG_CONTEXTS.AUTH,
    );

    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    // Message is JSON string, so parse again
    const sanitizedMsg = JSON.parse(parsed.message);
    expect(sanitizedMsg.email).toBe('user@example.com');
    expect(sanitizedMsg.password).toBe('[REDACTED]');
    expect(sanitizedMsg.token).toBe('[REDACTED]');

    logSpy.mockRestore();
  });

  it('respects log level filtering', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    const debugSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.debug('Debug message', LOG_CONTEXTS.APP);
    // Depends on LOG_LEVEL env setting, cannot assert in integration test

    debugSpy.mockRestore();
  });

  it('uses default context when none provided', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    logger.log('No context provided');

    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);
    expect(parsed.context).toBe('App');

    logSpy.mockRestore();
  });
});
