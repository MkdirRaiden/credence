// __tests__/unit/config/helpers/validate-config.spec.ts
import { validatePreConfig } from '@/config/helpers';
import { validEnv, criticalErrorEnv } from '../__fixtures__/env.fixtures';
import { BootstrapLogger } from '@/logger/services';

describe('validatePreConfig', () => {
  let mockLogger: jest.Mocked<BootstrapLogger>;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };

    mockLogger = {
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('validates correct environment variables', async () => {
    process.env = { ...validEnv };

    await expect(validatePreConfig(mockLogger)).resolves.toBeUndefined();
  });

  it('throws on critical error (missing JWT_SECRET)', async () => {
    process.env = { ...validEnv, JWT_SECRET: '' };

    await expect(validatePreConfig(mockLogger)).rejects.toThrow();
  });

  it('throws on critical error (invalid DATABASE_URL)', async () => {
    process.env = { ...validEnv, DATABASE_URL: 'not_a_url' };

    await expect(validatePreConfig(mockLogger)).rejects.toThrow();
  });

  it('throws on critical error (empty JWT_REFRESH_SECRET)', async () => {
    process.env = { ...validEnv, JWT_REFRESH_SECRET: '' };

    await expect(validatePreConfig(mockLogger)).rejects.toThrow();
  });

  it('throws on critical error (missing required fields)', async () => {
    process.env = { ...criticalErrorEnv };

    await expect(validatePreConfig(mockLogger)).rejects.toThrow();
  });

  it('logs warning for non-critical issues (PORT invalid)', async () => {
    process.env = { ...validEnv, PORT: 'not_a_number' };

    await validatePreConfig(mockLogger);

    expect(mockLogger.warn).toHaveBeenCalled();
  });

  it('validates critical fields: DATABASE_URL required', async () => {
    const { DATABASE_URL, ...envWithout } = validEnv;
    process.env = envWithout as any;

    await expect(validatePreConfig(mockLogger)).rejects.toThrow();
  });

  it('validates critical fields: JWT_SECRET required', async () => {
    const { JWT_SECRET, ...envWithout } = validEnv;
    process.env = envWithout as any;

    await expect(validatePreConfig(mockLogger)).rejects.toThrow();
  });

  it('validates critical fields: JWT_REFRESH_SECRET required', async () => {
    const { JWT_REFRESH_SECRET, ...envWithout } = validEnv;
    process.env = envWithout as any;

    await expect(validatePreConfig(mockLogger)).rejects.toThrow();
  });

  it('NODE_ENV is not critical (optional)', async () => {
    const { NODE_ENV, ...envWithout } = validEnv;
    process.env = envWithout as any;

    await expect(validatePreConfig(mockLogger)).resolves.toBeUndefined();
  });
});
