// __tests__/integration/logger.integration.spec.ts
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@/config/config.module';  // Add this!
import { LoggerModule } from '@/logger/logger.module';
import { LoggerService } from '@/logger/logger.service';

describe('LoggerModule (Integration)', () => {
  let logger: LoggerService;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule,    // Add this!
        LoggerModule,
      ],
    }).compile();

    logger = moduleRef.get(LoggerService);

    // Spy on console methods
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    debugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    debugSpy.mockRestore();
  });

  describe('Log Levels', () => {
    it('logs info messages', () => {
      logger.log('Test info message', 'TestContext');
      expect(logSpy).toHaveBeenCalled();
    });

    it('logs error messages', () => {
      logger.error('Test error message', undefined, 'TestContext');
      expect(errorSpy).toHaveBeenCalled();
    });

    it('logs warning messages', () => {
      logger.warn('Test warning message', 'TestContext');
      expect(warnSpy).toHaveBeenCalled();
    });

    it('logs debug messages', () => {
      logger.debug('Test debug message', 'TestContext');
      expect(debugSpy).toHaveBeenCalled();
    });
  });

  describe('Context Handling', () => {
    it('includes context in log output', () => {
      logger.log('Message with context', 'CustomContext');
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('CustomContext')
      );
    });

    it('handles missing context', () => {
      logger.log('Message without context');
      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe('Error Stack Traces', () => {
    it('logs error with stack trace', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', error.stack, 'ErrorContext');
      expect(errorSpy).toHaveBeenCalled();
    });

    it('handles error without stack', () => {
      logger.error('Error without stack', undefined, 'ErrorContext');
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  describe('Message Formatting', () => {
    it('formats simple string messages', () => {
      logger.log('Simple message', 'Context');
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Simple message')
      );
    });

    it('handles multiline messages', () => {
      const multiline = 'Line 1\nLine 2\nLine 3';
      logger.log(multiline, 'Context');
      expect(logSpy).toHaveBeenCalled();
    });
  });

  describe('Service Integration', () => {
    it('is injectable and usable', () => {
      expect(logger).toBeDefined();
      expect(logger.log).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.debug).toBeDefined();
    });
  });
});
