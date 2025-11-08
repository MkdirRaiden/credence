// __tests__/unit/logger/sanitize.helper.spec.ts
import { sanitizeLog } from '@/logger/helpers';

describe('sanitizeLog', () => {
  it('returns null and undefined as-is', () => {
    expect(sanitizeLog(null)).toBeNull();
    expect(sanitizeLog(undefined)).toBeUndefined();
  });

  it('returns primitives as-is', () => {
    expect(sanitizeLog('test')).toBe('test');
    expect(sanitizeLog(123)).toBe(123);
    expect(sanitizeLog(true)).toBe(true);
  });

  it('redacts sensitive fields in flat objects', () => {
    const input = {
      email: 'user@example.com',
      password: 'secret',
      token: 'xxx',
      apiKey: 'abc',
      passwordHash: 'hashed123',
      refreshToken: 'rtoken',
    };
    const sanitized = sanitizeLog(input) as Record<string, string>;
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.token).toBe('[REDACTED]');
    expect(sanitized.apiKey).toBe('[REDACTED]');
    expect(sanitized.passwordHash).toBe('[REDACTED]');
    expect(sanitized.refreshToken).toBe('[REDACTED]');
    expect(sanitized.email).toBe('user@example.com');
  });

  it('redacts fields with case-insensitive match', () => {
    const input = {
      Password: 'pw',
      Token: 'tk',
      passwordhash: 'ph',
      APIKEY: 'key',
    };
    const sanitized = sanitizeLog(input) as Record<string, string>;
    expect(sanitized.Password).toBe('[REDACTED]');
    expect(sanitized.Token).toBe('[REDACTED]');
    expect(sanitized.passwordhash).toBe('[REDACTED]');
    expect(sanitized.APIKEY).toBe('[REDACTED]');
  });

  it('recursively redacts nested sensitive fields', () => {
    const input = {
      user: {
        email: 'user@example.com',
        password: 'pw',
        profile: {
          apiKey: 'nestedKey',
        },
      },
      token: 'rootToken',
    };
    const sanitized = sanitizeLog(input) as {
      user: {
        email: string;
        password: string;
        profile: { apiKey: string };
      };
      token: string;
    };
    expect(sanitized.user.password).toBe('[REDACTED]');
    expect(sanitized.user.profile.apiKey).toBe('[REDACTED]');
    expect(sanitized.token).toBe('[REDACTED]');
    expect(sanitized.user.email).toBe('user@example.com');
  });

  it('sanitizes arrays of objects', () => {
    const input = [
      { password: 'pw1', token: 'tk1', data: 1 },
      { password: 'pw2', token: 'tk2', data: 2 },
    ];
    const sanitized = sanitizeLog(input) as Array<{ password: string; token?: string; data?: number }>;
    expect(sanitized[0].password).toBe('[REDACTED]');
    expect(sanitized[1].token).toBe('[REDACTED]');
    expect(sanitized[0].data).toBe(1);
  });

  it('does not redact fields not matching SENSITIVE_FIELDS', () => {
    const input = { foo: 'bar', bar: 'baz' };
    const sanitized = sanitizeLog(input) as Record<string, string>;
    expect(sanitized.foo).toBe('bar');
    expect(sanitized.bar).toBe('baz');
  });

  it('handles objects with undefined nested values', () => {
    const input = { password: undefined, info: { token: undefined } };
    const sanitized = sanitizeLog(input) as { password: string; info: { token: string } };
    expect(sanitized.password).toBe('[REDACTED]');
    expect(sanitized.info.token).toBe('[REDACTED]');
  });

  it('sanitizes mixed structures', () => {
    const input = [
      { apiKey: 'a', obj: { password: 'b' } },
      null,
      undefined,
      'plain',
      { foo: 'bar', token: 'c' },
    ];

    const sanitized = sanitizeLog(input) as Array<
      | { apiKey: string; obj: { password: string } }
      | null
      | undefined
      | string
      | { foo: string; token: string }
    >;

    if (sanitized[0] && typeof sanitized[0] === 'object' && 'apiKey' in sanitized[0]) {
      expect(sanitized[0].apiKey).toBe('[REDACTED]');
      expect(sanitized[0].obj.password).toBe('[REDACTED]');
    }

    expect(sanitized[1]).toBeNull();
    expect(sanitized[2]).toBeUndefined();
    expect(sanitized[3]).toBe('plain');

    if (sanitized[4] && typeof sanitized[4] === 'object' && 'token' in sanitized[4]) {
      expect(sanitized[4].token).toBe('[REDACTED]');
      expect(sanitized[4].foo).toBe('bar');
    }
  });

});
