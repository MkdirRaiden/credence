import { ConfigHelper } from 'src/config/config.helper';
import { CRITICAL_ENV_VARS } from 'src/common/constants';
import { BootstrapLogger } from 'src/logger/bootstrap-logger';

// Mock BootstrapLogger
jest.mock('src/logger/bootstrap-logger', () => ({
  BootstrapLogger: {
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('ConfigHelper.validatePreConfig', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();

    // Set valid values for all critical vars
    CRITICAL_ENV_VARS.forEach((key) => {
      switch (key) {
        case 'NODE_ENV':
          process.env[key] = 'development';
          break;
        case 'PORT':
          process.env[key] = '3000';
          break;
        case 'DATABASE_URL':
          process.env[key] = 'postgres://user:pass@localhost:5432/db';
          break;
        default:
          process.env[key] = 'dummy';
      }
    });
  });

  afterAll(() => {
    process.env = OLD_ENV;
    exitMock.mockRestore();
  });

  it('should not exit if all critical vars are present', () => {
    try {
      ConfigHelper.validatePreConfig();
    } catch (err) {
      // ignore simulated exit
    }

    expect(BootstrapLogger.error).not.toHaveBeenCalled();
  });

  it('should exit if any critical var is missing', () => {
    const missingVar = CRITICAL_ENV_VARS[0];
    delete process.env[missingVar];

    expect(() => ConfigHelper.validatePreConfig()).toThrow(`process.exit: 1`);

    expect(BootstrapLogger.error).toHaveBeenCalledWith(
      expect.stringContaining(missingVar),
      undefined,
      'ConfigHelper',
    );
  });

  it('should warn for non-critical invalid vars but not exit', () => {
    // Critical vars are already valid
    // Introduce an invalid non-critical var
    process.env.PORT = 'not-a-number';

    try {
      ConfigHelper.validatePreConfig();
    } catch (err) {
      // ignore simulated exit
    }

    expect(BootstrapLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Non-critical config issues'),
      'ConfigHelper',
    );
    expect(BootstrapLogger.error).not.toHaveBeenCalled();
  });
});

let exitMock: jest.SpyInstance;

beforeAll(() => {
  exitMock = jest.spyOn(process, 'exit').mockImplementation((code?: number) => {
    throw new Error(`process.exit: ${code}`);
  });
});
