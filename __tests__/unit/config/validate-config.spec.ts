import { validatePreConfig } from '@/config/helpers/validate-config';
import { BootstrapLogger } from '@/logger/bootstrap-logger';
import { validEnv, invalidEnv } from './__fixtures__/env.fixtures';

jest.mock('@/logger/bootstrap-logger');

describe('validatePreConfig', () => {
  const mockExit = jest
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);
  const mockLogger = new BootstrapLogger();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('✅ logs warning for non-critical issues', () => {
    process.env = { ...validEnv, NODE_ENV: 'invalid' }; // triggers non-critical
    validatePreConfig();
    expect(mockLogger.warn).toHaveBeenCalled();
  });

  it('🚫 exits process on critical error', () => {
    process.env = { ...invalidEnv };
    validatePreConfig();
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
