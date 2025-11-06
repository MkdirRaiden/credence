// __tests__/unit/config/validate-host.spec.ts
import { validateHost } from '@/config/validators';

describe('HostValidator', () => {
  it('should accept localhost', () => {
    expect(validateHost('localhost')).toBe('localhost');
  });

  it('should accept valid IPv4 address', () => {
    expect(validateHost('127.0.0.1')).toBe('127.0.0.1');
    expect(validateHost('0.0.0.0')).toBe('0.0.0.0');
    expect(validateHost('192.168.1.1')).toBe('192.168.1.1');
  });

  it('should reject invalid IPv4 address', () => {
    expect(() => validateHost('256.1.1.1')).toThrow('Invalid IPv4');
    expect(() => validateHost('192.168.1')).toThrow('Invalid HOST');
  });

  it('should accept valid IPv6 address', () => {
    expect(validateHost('[::1]')).toBe('[::1]');
    expect(validateHost('[2001:db8::1]')).toBe('[2001:db8::1]');
  });

  it('should accept valid hostname', () => {
    expect(validateHost('example.com')).toBe('example.com');
    expect(validateHost('app.example.com')).toBe('app.example.com');
  });

  it('should reject invalid hostname', () => {
    expect(() => validateHost('invalid..com')).toThrow('Invalid HOST');
    expect(() => validateHost('-invalid.com')).toThrow('Invalid HOST');
  });

  it('should reject empty host', () => {
    expect(() => validateHost('')).toThrow('cannot be empty');
  });
});
