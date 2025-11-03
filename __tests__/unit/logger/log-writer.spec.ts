// __tests__/unit/logger/log-writer.spec.ts
import { logWriter } from '@/logger/helpers/log-writer';

describe('logWriter', () => {
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    logSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('routes ERROR to console.error', () => {
    logWriter('ERROR', 'error msg');
    expect(errorSpy).toHaveBeenCalledWith('error msg');
    expect(warnSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('routes WARN to console.warn', () => {
    logWriter('WARN', 'warn msg');
    expect(warnSpy).toHaveBeenCalledWith('warn msg');
    expect(errorSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('routes INFO, DEBUG, VERBOSE to console.log', () => {
    logWriter('INFO', 'info msg');
    expect(logSpy).toHaveBeenCalledWith('info msg');
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();

    logSpy.mockClear();

    logWriter('DEBUG', 'debug msg');
    expect(logSpy).toHaveBeenCalledWith('debug msg');

    logSpy.mockClear();

    logWriter('VERBOSE', 'verbose msg');
    expect(logSpy).toHaveBeenCalledWith('verbose msg');
  });
});
