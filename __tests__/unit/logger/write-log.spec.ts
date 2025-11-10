// __tests__/unit/logger/write-log.spec.ts
import { writeLog } from '@/logger/helpers/output/write-log.helper';
import { shouldLog } from '@/common/interfaces';
import * as helpers from '@/logger/helpers';

jest.mock('@/common/interfaces', () => ({
  ...jest.requireActual('@/common/interfaces'),
  shouldLog: jest.fn(),
}));

jest.mock('@/logger/helpers', () => ({
  sanitizeLog: jest.fn((obj) => obj),
  formatLogJson: jest.fn(() => '{"level":"INFO","message":"test"}'),
  logWriter: jest.fn(),
}));

describe('writeLog', () => {
  const mockShouldLog = shouldLog as jest.MockedFunction<typeof shouldLog>;
  const mockSanitizeLog = helpers.sanitizeLog as jest.MockedFunction<
    typeof helpers.sanitizeLog
  >;
  const mockFormatLogJson = helpers.formatLogJson as jest.MockedFunction<
    typeof helpers.formatLogJson
  >;
  const mockLogWriter = helpers.logWriter as jest.MockedFunction<
    typeof helpers.logWriter
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('skips logging when shouldLog returns false', () => {
    mockShouldLog.mockReturnValue(false);

    writeLog('DEBUG', 'INFO', 'test');

    expect(mockFormatLogJson).not.toHaveBeenCalled();
    expect(mockLogWriter).not.toHaveBeenCalled();
  });

  it('sanitizes object messages', () => {
    mockShouldLog.mockReturnValue(true);
    const msg = { password: 'secret' };

    writeLog('INFO', 'INFO', msg);

    expect(mockSanitizeLog).toHaveBeenCalledWith(msg);
  });

  it('does not sanitize primitives', () => {
    mockShouldLog.mockReturnValue(true);

    writeLog('INFO', 'INFO', 'string');

    expect(mockSanitizeLog).not.toHaveBeenCalled();
  });

  it('passes all options to formatLogJson', () => {
    mockShouldLog.mockReturnValue(true);

    writeLog('ERROR', 'ERROR', 'msg', 'prod', 'Auth', 'stack');

    expect(mockFormatLogJson).toHaveBeenCalledWith('ERROR', 'msg', {
      context: 'Auth',
      env: 'prod',
      error: 'stack',
    });
  });

  it('calls logWriter with formatted output', () => {
    mockShouldLog.mockReturnValue(true);
    mockFormatLogJson.mockReturnValue('{"formatted":"json"}');

    writeLog('INFO', 'INFO', 'test');

    expect(mockLogWriter).toHaveBeenCalledWith('INFO', '{"formatted":"json"}');
  });
});
