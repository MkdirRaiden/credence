// __tests__/unit/bootstrap/helpers/handle-bootstrap-error.spec.ts
import { handleBootstrapError } from '@/bootstrap/helpers';
import { BootstrapLogger } from '@/logger/bootstrap-logger';

describe('handleBootstrapError', () => {
  let logger: BootstrapLogger;
  let errorSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new BootstrapLogger();
    errorSpy = jest.spyOn(logger, 'error').mockImplementation();
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('handles Error instances with stack trace', () => {
    const error = new Error('Test error');

    handleBootstrapError(error, logger, null);

    expect(errorSpy).toHaveBeenCalledWith(
      'Bootstrap failed: Test error',
      error.stack,
      'Bootstrap.error',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('handles string errors without stack trace', () => {
    handleBootstrapError('String error', logger, null);

    expect(errorSpy).toHaveBeenCalledWith(
      'Bootstrap failed: String error',
      undefined,
      'Bootstrap.error',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('gracefully closes app if provided', async () => {
    const mockApp = { close: jest.fn().mockResolvedValue(undefined) } as any;
    const logSpy = jest.spyOn(logger, 'log').mockImplementation();

    await handleBootstrapError(new Error('Test'), logger, mockApp);

    expect(mockApp.close).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('App closed gracefully', 'Bootstrap.error');
    expect(exitSpy).toHaveBeenCalledWith(1);
    logSpy.mockRestore();
  });
});
