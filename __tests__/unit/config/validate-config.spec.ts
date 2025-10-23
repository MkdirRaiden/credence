import { validatePreConfig } from '@/config/helpers/validate-config';
import { validEnv, invalidEnv } from './__fixtures__/env.fixtures';

describe('validatePreConfig', () => {
  let warnMock: jest.Mock;
  let errorMock: jest.Mock;
  let mockLogger: any;
  let mockExit: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    // Simple mock logger for testing
    warnMock = jest.fn();
    errorMock = jest.fn();
    mockLogger = { warn: warnMock, error: errorMock };

    /**
     * Mock process.exit — typed safely for TypeScript
     * Throws an error to simulate exit and stop execution
     */
    mockExit = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: number | string | null) => {
        throw new Error(`process.exit(${code})`);
      });
  });

  afterAll(() => {
    mockExit.mockRestore();
  });

  it('✅ does nothing when all env vars are valid', () => {
    process.env = { ...validEnv };

    expect(() => validatePreConfig(mockLogger)).not.toThrow();

    expect(warnMock).not.toHaveBeenCalled();
    expect(errorMock).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('✅ logs warning for non-critical issues only', () => {
    // Non-critical failure: ALLOWED_ORIGINS invalid but NODE_ENV is valid
    process.env = { ...validEnv, ALLOWED_ORIGINS: 'invalid_url' };

    expect(() => validatePreConfig(mockLogger)).not.toThrow();

    expect(warnMock).toHaveBeenCalled(); // warns only
    expect(errorMock).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('🚫 exits process on critical error', () => {
    // Critical failure: invalid NODE_ENV & DATABASE_URL
    process.env = { ...invalidEnv };

    expect(() => validatePreConfig(mockLogger)).toThrow('process.exit(1)');
    expect(errorMock).toHaveBeenCalled(); // logs error before exit
    expect(warnMock).not.toHaveBeenCalled(); // never reaches warnings
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
