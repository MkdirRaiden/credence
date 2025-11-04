// __tests__/unit/bootstrap/helpers/handle-bootstrap-error.spec.ts
import { handleBootstrapError } from '@/bootstrap/helpers';
import { BootstrapLogger } from '@/logger/bootstrap-logger';

describe('handleBootstrapError', () => {
  let logger: BootstrapLogger;
  let errorSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new BootstrapLogger();
    errorSpy = jest.spyOn(logger, 'error').mockImplementation();
    logSpy = jest.spyOn(logger, 'log').mockImplementation();
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(
      () => undefined as never,
    );
  });

  afterEach(() => {
    errorSpy.mockRestore();
    logSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('logs Error with stack trace', () => {
    const error = new Error('Database connection failed');

    handleBootstrapError(error, logger, null);

    expect(errorSpy).toHaveBeenCalledWith(
      'Bootstrap failed: Database connection failed',
      error.stack,
      'Bootstrap',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('logs string errors without stack', () => {
    handleBootstrapError('String error message', logger, null);

    expect(errorSpy).toHaveBeenCalledWith(
      'Bootstrap failed: String error message',
      undefined,
      'Bootstrap',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('closes app gracefully on error', async () => {
    const mockApp = { close: jest.fn().mockResolvedValue(undefined) } as any;

    await handleBootstrapError(new Error('Test'), logger, mockApp);

    expect(mockApp.close).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('App closed gracefully', 'Bootstrap');
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('handles app close errors gracefully', async () => {
    const mockApp = {
      close: jest.fn().mockRejectedValue(new Error('Close failed')),
    } as any;

    await handleBootstrapError(new Error('Test'), logger, mockApp);

    expect(errorSpy).toHaveBeenCalledWith(
      'Error closing app: Close failed',
      undefined,
      'Bootstrap',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('exits with code 1', () => {
    handleBootstrapError(new Error('Fatal'), logger, null);

    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
