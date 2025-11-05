// __tests__/unit/logger/base-logger.spec.ts
import { BaseLogger } from '@/logger/base/base-logger';
import * as loggerHelpers from '@/logger/helpers';

jest.mock('@/logger/helpers', () => ({
  formatLogJson: jest.fn((level, msg, opts) =>
    JSON.stringify({ level, msg, opts }),
  ),
  logWriter: jest.fn(),
}));

describe('BaseLogger', () => {
  let logger: BaseLogger;
  const mockFormatLogJson = loggerHelpers.formatLogJson as jest.Mock;
  const mockLogWriter = loggerHelpers.logWriter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = new BaseLogger('development');
  });

  it('log calls formatLogJson and logWriter with INFO level', () => {
    logger.log('hello', 'CTX');

    expect(mockFormatLogJson).toHaveBeenCalledWith('INFO', 'hello', {
      context: 'CTX',
      env: 'development',
    });
    expect(mockLogWriter).toHaveBeenCalledWith('INFO', expect.any(String));
  });

  it('error calls formatLogJson with error parameter', () => {
    const err = new Error('fail');
    logger.error('error-msg', err, 'CTX');

    expect(mockFormatLogJson).toHaveBeenCalledWith(
      'ERROR',
      'error-msg',
      expect.objectContaining({
        context: 'CTX',
        env: 'development',
        error: err,
      }),
    );
    expect(mockLogWriter).toHaveBeenCalledWith('ERROR', expect.any(String));
  });

  it('warn calls formatLogJson and logWriter with WARN level', () => {
    logger.warn('warn-msg', 'CTX');

    expect(mockFormatLogJson).toHaveBeenCalledWith('WARN', 'warn-msg', {
      context: 'CTX',
      env: 'development',
    });
    expect(mockLogWriter).toHaveBeenCalledWith('WARN', expect.any(String));
  });

  it('debug logs only in non-production', () => {
    logger.debug('debug-msg', 'CTX');
    expect(mockFormatLogJson).toHaveBeenCalledWith('DEBUG', 'debug-msg', {
      context: 'CTX',
      env: 'development',
    });

    mockFormatLogJson.mockClear();
    const prodLogger = new BaseLogger('production');
    prodLogger.debug('debug-msg', 'CTX');
    expect(mockFormatLogJson).not.toHaveBeenCalled();
  });

  it('verbose logs only in non-production', () => {
    logger.verbose('verbose-msg', 'CTX');
    expect(mockFormatLogJson).toHaveBeenCalledWith('VERBOSE', 'verbose-msg', {
      context: 'CTX',
      env: 'development',
    });

    mockFormatLogJson.mockClear();
    const prodLogger = new BaseLogger('production');
    prodLogger.verbose('verbose-msg', 'CTX');
    expect(mockFormatLogJson).not.toHaveBeenCalled();
  });
});
