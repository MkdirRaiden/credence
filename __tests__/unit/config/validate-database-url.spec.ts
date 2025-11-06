// __tests__/unit/config/validate-database-url.spec.ts
import { validateDatabaseUrl } from '@/config/validators';

describe('DatabaseUrlValidator', () => {
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

  it('should reject URL without hostname', () => {
    expect(() => validateDatabaseUrl('postgresql://user:pass@/db')).toThrow(
      'must include hostname',
    );
  });

  it('should reject URL without database name', () => {
    expect(() => validateDatabaseUrl('postgresql://user:pass@localhost')).toThrow(
      'must include database name',
    );
  });

  it('should reject invalid port', () => {
    expect(() => validateDatabaseUrl('postgresql://user:pass@localhost:99999/db')).toThrow(
      'Invalid port',
    );
  });

  it('should reject empty URL', () => {
    expect(() => validateDatabaseUrl('')).toThrow('cannot be empty');
  });

  it('should reject invalid URL format', () => {
    expect(() => validateDatabaseUrl('not-a-url')).toThrow('Invalid format');
  });
});