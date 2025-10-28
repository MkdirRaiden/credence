// __tests__/unit/bootstrap/handle-bootstrap-error.spec.ts
import { handleBootstrapError } from '@/bootstrap/helpers/handle-bootstrap-error';
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

  describe('Error type handling', () => {
    it('handles Error instances correctly', () => {
      const error = new Error('Test error');
      
      expect(() => handleBootstrapError(error, logger)).toThrow('process.exit called');
      
      expect(errorSpy).toHaveBeenCalledWith(
        'Bootstrap failed, err: Test error',
        error.stack,
        'Bootstrap.error',
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('handles string errors', () => {
      expect(() => handleBootstrapError('String error', logger)).toThrow('process.exit called');
      
      expect(errorSpy).toHaveBeenCalledWith(
        'Bootstrap failed, err: String error',
        undefined,
        'Bootstrap.error',
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('handles non-Error objects', () => {
      const errorObj = { code: 'ERR_UNKNOWN', details: 'Something went wrong' };
      
      expect(() => handleBootstrapError(errorObj, logger)).toThrow('process.exit called');
      
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Bootstrap failed, err:'),
        undefined,
        'Bootstrap.error',
      );
      expect(exitSpy).toHaveBeenCalledWith(1);
    });

    it('handles null and undefined', () => {
      expect(() => handleBootstrapError(null, logger)).toThrow('process.exit called');
      expect(exitSpy).toHaveBeenCalledWith(1);

      exitSpy.mockClear();
      
      expect(() => handleBootstrapError(undefined, logger)).toThrow('process.exit called');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('Error with stack trace', () => {
    it('includes stack trace for Error instances', () => {
      const error = new Error('Error with stack');
      const stack = error.stack;
      
      expect(() => handleBootstrapError(error, logger)).toThrow('process.exit called');
      
      expect(errorSpy).toHaveBeenCalledWith(
        'Bootstrap failed, err: Error with stack',
        stack,
        'Bootstrap.error',
      );
    });
  });

  describe('Process exit', () => {
    it('exits with code 1', () => {
      const error = new Error('Fatal error');
      
      expect(() => handleBootstrapError(error, logger)).toThrow('process.exit called');
      expect(exitSpy).toHaveBeenCalledWith(1);
    });
  });
});
