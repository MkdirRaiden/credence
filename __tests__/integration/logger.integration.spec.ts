// __tests__/integration/logger.integration.spec.ts
import { LoggerService } from '@/logger/logger.service';
import { createTestModule } from './__helpers__/test-module.factory';

describe('LoggerModule (Integration)', () => {
  let logger: LoggerService;
  let consoleSpy: jest.SpyInstance;

  beforeAll(async () => {
    const moduleRef = await createTestModule();
    logger = moduleRef.get(LoggerService);
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('logs messages with context', () => {
    logger.log('Test message', 'TestContext');

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('TestContext'),
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Test message'),
    );
  });

  it('logs errors with stack traces', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('Test error');

    logger.error('Error occurred', error.stack, 'ErrorContext');

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('provides all required log methods', () => {
    expect(logger.log).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
    expect(logger.verbose).toBeDefined();
  });
});
