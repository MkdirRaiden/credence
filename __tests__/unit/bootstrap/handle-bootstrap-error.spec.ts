// __tests__/unit/bootstrap/helpers/handle-bootstrap-error.spec.ts
import { handleBootstrapError } from '@/bootstrap/helpers';
import { BootstrapLogger } from '@/logger/services';

describe('handleBootstrapError', () => {
  let logger: BootstrapLogger;
  let errorSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new BootstrapLogger();
    errorSpy = jest.spyOn(logger, 'error').mockImplementation();
    logSpy = jest.spyOn(logger, 'log').mockImplementation();
    warnSpy = jest.spyOn(logger, 'warn').mockImplementation();
    exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    errorSpy.mockRestore();
    logSpy.mockRestore();
    warnSpy.mockRestore();
    exitSpy.mockRestore();
    jest.clearAllTimers();
  });

  it('logs Error with stack trace', async () => {
    const error = new Error('Database connection failed');

    try {
      await handleBootstrapError(error, logger, null);
    } catch {
      // Expected: function never returns (calls process.exit)
    }

    expect(errorSpy).toHaveBeenCalledWith(
      'Bootstrap failed: Database connection failed',
      error.stack,
      'Bootstrap',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('logs string errors without stack', async () => {
    try {
      await handleBootstrapError('String error message', logger, null);
    } catch {
      // Expected
    }

    expect(errorSpy).toHaveBeenCalledWith(
      'Bootstrap failed: String error message',
      undefined,
      'Bootstrap',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('closes app gracefully on error', async () => {
    const mockApp = { close: jest.fn().mockResolvedValue(undefined) } as any;

    try {
      await handleBootstrapError(new Error('Test'), logger, mockApp);
    } catch {
      // Expected
    }

    expect(mockApp.close).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('App closed gracefully', 'Bootstrap');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('logs WARN on app close error', async () => {
    const mockApp = {
      close: jest.fn().mockRejectedValue(new Error('Close failed')),
    } as any;

    try {
      await handleBootstrapError(new Error('Test'), logger, mockApp);
    } catch {
      // Expected
    }

    expect(warnSpy).toHaveBeenCalledWith(
      'App close timeout/error: Close failed',
      'Bootstrap',
    );
    expect(errorSpy).toHaveBeenCalledTimes(1); // Only initial error
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('exits with code 1 regardless of outcome', async () => {
    try {
      await handleBootstrapError(new Error('Fatal'), logger, null);
    } catch {
      // Expected
    }

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
