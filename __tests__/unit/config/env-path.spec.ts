// __tests__/unit/config/env-path.spec.ts
import fs from 'fs';
import { getEnvFilePaths } from '@/config/helpers/env-paths';

jest.mock('fs');

describe('getEnvFilePaths', () => {
  it('✅ returns path if file exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const paths = getEnvFilePaths();
    expect(paths[0]).toContain('env/.env.test');
  });

  it('🚫 returns empty array if file missing', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    expect(getEnvFilePaths()).toEqual([]);
  });
});
