// __tests__/unit/logger/base-logger.spec.ts
import { BaseLogger } from '@/logger/base-logger';
import { formatLogJson } from '@/logger/helpers/format-log-json';

jest.mock('@/logger/helpers/format-log-json', () => ({
  formatLogJson: jest.fn((level, msg, opts) => JSON.stringify({ level, msg, opts })),
}));

describe('BaseLogger', () => {
  let logger: BaseLogger;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = new BaseLogger('development', () => ({ requestId: 'abc123' }));
  });

  it('log calls console.log with formatted message', () => {
    console.log = jest.fn();
    logger.log('hello', 'CTX');
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({ level: 'INFO', msg: 'hello', opts: { context: 'CTX', env: 'development', meta: { requestId: 'abc123' } } })
    );
  });

  it('warn calls console.warn with formatted message', () => {
    console.warn = jest.fn();
    logger.warn('warn-msg', 'CTX');
    expect(console.warn).toHaveBeenCalled();
  });

  it('error calls console.error with formatted message and trace/error', () => {
    console.error = jest.fn();
    const err = new Error('fail');
    logger.error('error-msg', err, 'CTX');
    expect(console.error).toHaveBeenCalled();
    // optional: check error key passed to formatLogJson
    expect(formatLogJson).toHaveBeenCalledWith('ERROR', 'error-msg', expect.objectContaining({ error: err }));
  });

  it('debug logs only outside production', () => {
    console.debug = jest.fn();
    logger.debug('debug-msg', 'CTX');
    expect(console.debug).toHaveBeenCalled();

    const prodLogger = new BaseLogger('production');
    console.debug = jest.fn();
    prodLogger.debug('debug-msg', 'CTX');
    expect(console.debug).not.toHaveBeenCalled();
  });

  it('verbose logs only outside production', () => {
    console.debug = jest.fn();
    logger.verbose('verbose-msg', 'CTX');
    expect(console.debug).toHaveBeenCalled();

    const prodLogger = new BaseLogger('production');
    console.debug = jest.fn();
    prodLogger.verbose('verbose-msg', 'CTX');
    expect(console.debug).not.toHaveBeenCalled();
  });

  it('meta function is optional', () => {
    const noMetaLogger = new BaseLogger('development');
    console.log = jest.fn();
    noMetaLogger.log('msg');
    expect(console.log).toHaveBeenCalled();
    expect(formatLogJson).toHaveBeenCalledWith('INFO', 'msg', expect.objectContaining({ meta: undefined }));
  });
});
