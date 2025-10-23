// __tests__/unit/common/utils/shutdown-database.spec.ts
import { gracefulShutdown } from '@/common/utils/shutdown-database';

jest.useFakeTimers();

describe('gracefulShutdown', () => {
  let logger: any;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = { error: jest.fn() };
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      // Prevent actual process exit
      return undefined as never;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    exitSpy.mockRestore();
  });

  it('✅ logs the shutdown message and calls process.exit after default delay', () => {
    gracefulShutdown(logger);

    expect(logger.error).toHaveBeenCalledWith('Critical shutdown', undefined, 'Shutdown');

    // Fast-forward timers
    jest.advanceTimersByTime(5000); // default SHUTDOWN_TIMEOUT_MS
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('✅ logs custom message and respects custom delay', () => {
    gracefulShutdown(logger, 'Custom message', 100);

    expect(logger.error).toHaveBeenCalledWith('Custom message', undefined, 'Shutdown');

    jest.advanceTimersByTime(100);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
