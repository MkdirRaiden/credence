// __tests__/integration/logger.integration.spec.ts
import { LoggerService } from '@/logger/services';
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
    
    logger.log('Structured test', 'TestCtx');
    
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0][0];
    expect(() => JSON.parse(output)).not.toThrow();
    
    logSpy.mockRestore();
  });


  it('logs messages with context', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    
    logger.log('Test info message', 'TestContext');
    
    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls[0][0];
    expect(output).toContain('TestContext');
    
    logSpy.mockRestore();
  });


  it('logs errors with stack trace', () => {
    const logger = context.getService<LoggerService>(LoggerService);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    const error = new Error('Test error');
    logger.error('Error occurred', error, 'ErrorContext');
    
    expect(errorSpy).toHaveBeenCalled();
    
    errorSpy.mockRestore();
  });


  it('includes requestId when available in context', () => {
    const logger = context.getService<LoggerService>(LoggerService);
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
    const logger = context.getService<LoggerService>(LoggerService);
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
