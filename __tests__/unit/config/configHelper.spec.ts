import { ConfigHelper } from '@/config/config.helper';
import { DEFAULT_ENV } from '@/common/constants';
import * as fs from 'node:fs';
import * as path from 'path';

// Mock fs module
jest.mock('node:fs', () => ({
  ...jest.requireActual('node:fs'),
  existsSync: jest.fn(),
}));

describe('ConfigHelper.getEnvFilePaths', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should return main env file if it exists', () => {
    process.env.NODE_ENV = 'test';
    const mainPath = path.resolve(process.cwd(), 'env/.env.test');

    (fs.existsSync as jest.Mock).mockImplementation(
      (filePath) => filePath === mainPath,
    );

    const files = ConfigHelper.getEnvFilePaths();
    expect(files).toEqual([mainPath]);
  });

  it('should return empty array if main env file does not exist', () => {
    process.env.NODE_ENV = 'test';

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const files = ConfigHelper.getEnvFilePaths();
    expect(files).toEqual([]);
  });

  it('should use DEFAULT_ENV if NODE_ENV is not set', () => {
    delete process.env.NODE_ENV;
    const mainPath = path.resolve(process.cwd(), `env/.env.${DEFAULT_ENV}`);

    (fs.existsSync as jest.Mock).mockImplementation(
      (filePath) => filePath === mainPath,
    );

    const files = ConfigHelper.getEnvFilePaths();
    expect(files).toEqual([mainPath]);
  });
});
