import { BootstrapLogger } from '@/logger/bootstrap-logger';
import * as loggerUtil from '@/common/utils/logger.util';

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('BootstrapLogger', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log INFO messages', () => {
    const spy = jest.spyOn(loggerUtil, 'formatMessage');
    BootstrapLogger.log('hello', 'CTX');
    expect(spy).toHaveBeenCalledWith('INFO', 'hello', 'CTX');
    expect(console.log).toHaveBeenCalled();
  });

  it('should log WARN messages', () => {
    const spy = jest.spyOn(loggerUtil, 'formatMessage');
    BootstrapLogger.warn('warning', 'CTX');
    expect(spy).toHaveBeenCalledWith('WARN', 'warning', 'CTX');
    expect(console.warn).toHaveBeenCalled();
  });

  it('should log ERROR messages with optional trace', () => {
    const spy = jest.spyOn(loggerUtil, 'formatMessage');
    BootstrapLogger.error('error', 'trace info', 'CTX');
    expect(spy).toHaveBeenCalledWith(
      'ERROR',
      'error | Trace: trace info',
      'CTX',
    );
    expect(console.error).toHaveBeenCalled();
  });

  it('should log ERROR messages without trace', () => {
    const spy = jest.spyOn(loggerUtil, 'formatMessage');
    BootstrapLogger.error('error only', undefined, 'CTX');
    expect(spy).toHaveBeenCalledWith('ERROR', 'error only', 'CTX');
    expect(console.error).toHaveBeenCalled();
  });
});
