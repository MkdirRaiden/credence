// __tests__/unit/config/validators/validate-database-url.spec.ts
import { validateDatabaseUrl } from '@/config/validators';

describe('validateDatabaseUrl', () => {
  it('should accept valid PostgreSQL URL', () => {
    const url = 'postgresql://user:pass@localhost:5432/credence';
    expect(validateDatabaseUrl(url)).toBe(url);
  });

  it('should accept postgres:// protocol', () => {
    const url = 'postgres://user:pass@db.example.com/mydb';
    expect(validateDatabaseUrl(url)).toBe(url);
  });

  it('should accept URL without port (default 5432)', () => {
    const url = 'postgresql://user:pass@localhost/credence';
    expect(validateDatabaseUrl(url)).toBe(url);
  });

  it('should reject non-PostgreSQL protocol', () => {
    expect(() => validateDatabaseUrl('mysql://user:pass@localhost/db')).toThrow(
      'protocol must be',
    );
  });

  it('should reject invalid URL format', () => {
    expect(() => validateDatabaseUrl('not-a-url')).toThrow('Invalid');
  });

  it('should reject URL without database name', () => {
    expect(() =>
      validateDatabaseUrl('postgresql://user:pass@localhost'),
    ).toThrow('must include database name');
  });

  it('should reject port 0', () => {
    expect(() =>
      validateDatabaseUrl('postgresql://user:pass@localhost:0/db'),
    ).toThrow('Invalid port');
  });

  it('should reject empty URL', () => {
    expect(() => validateDatabaseUrl('')).toThrow('cannot be empty');
  });

  it('should reject whitespace-only URL', () => {
    expect(() => validateDatabaseUrl('   ')).toThrow('cannot be empty');
  });

  it('should warn if username missing', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    validateDatabaseUrl('postgresql://localhost/credence');
    expect(consoleWarnSpy).toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });
});
