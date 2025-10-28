// __tests__/unit/config/env-path.spec.ts
import fs from 'fs';
import path from 'path';
import { getEnvFilePaths } from '@/config/helpers/env-paths';

jest.mock('fs');

describe('getEnvFilePaths', () => {
  const mockExistsSync = fs.existsSync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns env folder path when it exists', () => {
    // Mock: env/.env.test exists
    mockExistsSync.mockReturnValue(true);

    const paths = getEnvFilePaths();

    expect(paths).toHaveLength(1);
    expect(paths[0]).toContain('env/.env.test');
    expect(mockExistsSync).toHaveBeenCalledTimes(1);
  });

  it('returns root .env when env folder file does not exist but root .env exists', () => {
    // Mock: env/.env.test does NOT exist, but root .env does
    mockExistsSync
      .mockReturnValueOnce(false) // First call: env/.env.test doesn't exist
      .mockReturnValueOnce(true);  // Second call: root .env exists

    const paths = getEnvFilePaths();

    expect(paths).toHaveLength(1);
    expect(paths[0]).toContain('.env');
    expect(paths[0]).not.toContain('env/');
    expect(mockExistsSync).toHaveBeenCalledTimes(2);
  });

  it('returns empty array when neither env folder file nor root .env exists', () => {
    // Mock: both files don't exist
    mockExistsSync.mockReturnValue(false);

    const paths = getEnvFilePaths();

    expect(paths).toEqual([]);
    expect(mockExistsSync).toHaveBeenCalledTimes(2);
  });

  it('checks correct file paths', () => {
    mockExistsSync.mockReturnValue(false);

    getEnvFilePaths();

    const calls = mockExistsSync.mock.calls;
    
    // First call should check env folder
    expect(calls[0][0]).toContain(path.join('env', '.env.test'));
    
    // Second call should check root .env
    expect(calls[1][0]).toContain('.env');
    expect(calls[1][0]).not.toContain(path.join('env', '.env'));
  });
});
