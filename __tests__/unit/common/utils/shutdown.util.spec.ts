// __tests__/unit/common/utils/shutdown.util.spec.ts
import { LoggerService } from '@/logger/logger.service';
import { gracefulShutdown } from '@/common/utils/shutdown.util';

describe('gracefulShutdown', () => {
  let logger: LoggerService;
  let exitMock: jest.SpyInstance;

  beforeEach(() => {
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;
    jest.useFakeTimers();
    exitMock = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    exitMock.mockRestore();
  });

  it('should log error and exit after delay', () => {
    expect(() => {
      gracefulShutdown(logger, 'Shutdown', 100);
      jest.runAllTimers(); // fast-forward setTimeout
    }).toThrow('process.exit called');

    expect(logger.error).toHaveBeenCalledWith(
      'Shutdown',
      undefined,
      'Shutdown',
    );
  });
});
