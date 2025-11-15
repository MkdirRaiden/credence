// __tests__/unit/logger/write-log.spec.ts
import { writeLog } from '@/logger/helpers';
import { shouldLog } from '@/common/interfaces';

jest.mock('@/common/interfaces', () => ({
  ...jest.requireActual('@/common/interfaces'),
  shouldLog: jest.fn(),
}));

describe('writeLog', () => {
  const mockShouldLog = shouldLog as jest.MockedFunction<typeof shouldLog>;

  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('skips logging when shouldLog returns false', () => {
    mockShouldLog.mockReturnValue(false);

    writeLog('DEBUG', 'INFO', 'test');

    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('sanitizes object messages', () => {
    mockShouldLog.mockReturnValue(true);
    const msg = { password: 'secret' };

    writeLog('INFO', 'INFO', msg);

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const [loggedJson] = consoleLogSpy.mock.calls[0];

    const parsed = JSON.parse(loggedJson as string);
    // Message should be JSON of the sanitized object, so no raw "secret"
    expect(String(parsed.message)).toContain('[REDACTED]');
    expect(String(parsed.message)).not.toContain('secret');
  });

  it('does not sanitize primitives', () => {
    mockShouldLog.mockReturnValue(true);

    writeLog('INFO', 'INFO', 'string');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const [loggedJson] = consoleLogSpy.mock.calls[0];

    const parsed = JSON.parse(loggedJson as string);
    expect(parsed.message).toBe('string');
  });

  it('passes env, context and error into formatted output', () => {
    mockShouldLog.mockReturnValue(true);

    writeLog('ERROR', 'ERROR', 'msg', 'prod', 'Auth', 'stack');

    // ERROR level goes to console.error via logWriter
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const [loggedJson] = consoleErrorSpy.mock.calls[0];

    const parsed = JSON.parse(loggedJson as string);

    // level/env/context/error metadata come from formatLogJson pipeline
    expect(parsed.level).toBe('ERROR');
    expect(parsed.env).toBe('prod');
    expect(parsed.context).toBe('Auth');
    expect(parsed.trace).toBe('stack'); // from errorMeta for non-Error values
  });

  it('calls console with formatted JSON for info logs', () => {
    mockShouldLog.mockReturnValue(true);

    writeLog('INFO', 'INFO', 'test');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const [loggedJson] = consoleLogSpy.mock.calls[0];

    // Should be valid JSON
    const parsed = JSON.parse(loggedJson as string);
    expect(parsed.level).toBe('INFO');
    expect(parsed.message).toBe('test');
  });
});
