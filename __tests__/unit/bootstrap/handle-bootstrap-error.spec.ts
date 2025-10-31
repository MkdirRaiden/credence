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
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    errorSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it('handles Error instances with stack trace and exits', () => {
    const error = new Error('Test error');

    expect(() => handleBootstrapError(error, logger)).toThrow(
      'process.exit called',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Bootstrap failed, err: Test error',
      error.stack,
      'Bootstrap.error',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('handles string errors without stack trace', () => {
    expect(() => handleBootstrapError('String error', logger)).toThrow(
      'process.exit called',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Bootstrap failed, err: String error',
      undefined,
      'Bootstrap.error',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('handles non-Error objects by stringifying', () => {
    const errorObj = { code: 'ERR_UNKNOWN' };

    expect(() => handleBootstrapError(errorObj, logger)).toThrow(
      'process.exit called',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Bootstrap failed, err: [object Object]',
      undefined,
      'Bootstrap.error',
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
