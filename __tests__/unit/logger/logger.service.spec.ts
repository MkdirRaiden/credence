import { LoggerService } from '@/logger/logger.service';
import * as loggerUtil from '@/common/utils/logger.util';

const mockConfigService = { get: jest.fn() };

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'debug').mockImplementation(() => {});

describe('LoggerService', () => {
  let logger: LoggerService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfigService.get.mockReturnValue('development');
    logger = new LoggerService(mockConfigService as any);
  });

  it('should log INFO messages', () => {
    const spy = jest.spyOn(loggerUtil, 'formatMessage');
    logger.log('info message', 'CTX');
    expect(spy).toHaveBeenCalledWith('INFO', 'info message', 'CTX');
    expect(console.log).toHaveBeenCalled();
  });

  it('should log WARN messages', () => {
    const spy = jest.spyOn(loggerUtil, 'formatMessage');
    logger.warn('warn message', 'CTX');
    expect(spy).toHaveBeenCalledWith('WARN', 'warn message', 'CTX');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should log ERROR messages with optional trace', () => {
    const spy = jest.spyOn(loggerUtil, 'formatMessage');
    logger.error('error message', 'trace info', 'CTX');
    expect(spy).toHaveBeenCalledWith(
      'ERROR',
      'error message | Trace: trace info',
      'CTX',
    );
    expect(console.error).toHaveBeenCalled();
  });

  it('should log DEBUG messages in non-production', () => {
    const spy = jest.spyOn(loggerUtil, 'formatMessage');
    logger.debug('debug message', 'CTX');
    expect(spy).toHaveBeenCalledWith('DEBUG', 'debug message', 'CTX');
    expect(console.debug).toHaveBeenCalled();
  });

  it('should skip DEBUG messages in production', () => {
    mockConfigService.get.mockReturnValue('production');
    logger = new LoggerService(mockConfigService as any);

    logger.debug('debug message', 'CTX');
    expect(console.debug).not.toHaveBeenCalled();
  });

  it('should log VERBOSE messages in non-production', () => {
    const spy = jest.spyOn(loggerUtil, 'formatMessage');
    logger.verbose('verbose message', 'CTX');
    expect(spy).toHaveBeenCalledWith('VERBOSE', 'verbose message', 'CTX');
    expect(console.debug).toHaveBeenCalled();
  });

  it('should skip VERBOSE messages in production', () => {
    mockConfigService.get.mockReturnValue('production');
    logger = new LoggerService(mockConfigService as any);

    logger.verbose('verbose message', 'CTX');
    expect(console.debug).not.toHaveBeenCalled();
  });
});
