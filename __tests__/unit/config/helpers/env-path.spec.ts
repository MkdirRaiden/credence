// __tests__/unit/config/helpers/env-path.spec.ts
import fs from 'fs';
import path from 'path';
import { getEnvFilePaths } from '@/config/helpers';

jest.mock('fs');

describe('getEnvFilePaths', () => {
  const mockExistsSync = fs.existsSync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct path based on file existence priority', () => {
    // Scenario 1: env/.env.test exists
    mockExistsSync.mockReturnValue(true);
    const paths1 = getEnvFilePaths();
    expect(paths1).toHaveLength(1);
    expect(paths1[0]).toContain('env/.env.test');

    // Scenario 2: env/.env.test missing, root .env exists
    mockExistsSync.mockReturnValueOnce(false).mockReturnValueOnce(true);
    const paths2 = getEnvFilePaths();
    expect(paths2).toHaveLength(1);
    expect(paths2[0]).toContain('.env');
    expect(paths2[0]).not.toContain('env/');

    // Scenario 3: neither exists
    mockExistsSync.mockReturnValue(false);
    expect(getEnvFilePaths()).toEqual([]);
  });

  it('checks correct file paths in order', () => {
    mockExistsSync.mockReturnValue(false);
    getEnvFilePaths();

    const calls = mockExistsSync.mock.calls;
    expect(calls[0][0]).toContain(path.join('env', '.env.test'));
    expect(calls[1][0]).toContain('.env');
    expect(calls[1][0]).not.toContain(path.join('env', '.env'));
  });
});
