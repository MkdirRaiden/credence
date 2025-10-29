// __tests__/unit/logger/base-logger.spec.ts
import { BaseLogger } from '@/logger/base-logger';
import { formatLogJson } from '@/logger/helpers/format-log-json';

jest.mock('@/logger/helpers/format-log-json', () => ({
  formatLogJson: jest.fn((level, msg, opts) =>
    JSON.stringify({ level, msg, opts }),
  ),
}));

describe('BaseLogger', () => {
  let logger: BaseLogger;
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = new BaseLogger('development');
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
    debugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
    debugSpy.mockRestore();
  });

  it('log calls console.log with formatted message', () => {
    logger.log('hello', 'CTX');
    
    expect(logSpy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'INFO',
        msg: 'hello',
        opts: { context: 'CTX', env: 'development' },
      }),
    );
  });

  it('warn and error call correct console methods', () => {
    logger.warn('warn-msg', 'CTX');
    expect(warnSpy).toHaveBeenCalled();

    const err = new Error('fail');
    logger.error('error-msg', err, 'CTX');
    expect(errorSpy).toHaveBeenCalled();
    expect(formatLogJson).toHaveBeenCalledWith(
      'ERROR',
      'error-msg',
      expect.objectContaining({ error: err }),
    );
  });

  it('debug and verbose only log outside production', () => {
    logger.debug('debug-msg', 'CTX');
    logger.verbose('verbose-msg', 'CTX');
    expect(debugSpy).toHaveBeenCalledTimes(2);

    debugSpy.mockClear();
    const prodLogger = new BaseLogger('production');
    prodLogger.debug('debug-msg', 'CTX');
    prodLogger.verbose('verbose-msg', 'CTX');
    expect(debugSpy).not.toHaveBeenCalled();
  });
});
