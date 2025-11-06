// __tests__/unit/config/validate-port.spec.ts
import { validatePort } from '@/config/validators';

describe('PortValidator', () => {
  it('should accept valid port number', () => {
    expect(validatePort(3000)).toBe(3000);
  });

  it('should accept port as string', () => {
    expect(validatePort('3000')).toBe(3000);
  });

  it('should accept common ports', () => {
    expect(validatePort(80)).toBe(80);
    expect(validatePort(443)).toBe(443);
    expect(validatePort(8080)).toBe(8080);
  });

  it('should reject port 0', () => {
    expect(() => validatePort(0)).toThrow('between 1 and 65535');
  });

  it('should reject port > 65535', () => {
    expect(() => validatePort(99999)).toThrow('between 1 and 65535');
  });

  it('should reject negative port', () => {
    expect(() => validatePort(-3000)).toThrow('between 1 and 65535');
  });

  it('should reject invalid string', () => {
    expect(() => validatePort('not-a-number')).toThrow('must be a valid number');
  });

  it('should reject float port', () => {
    expect(() => validatePort(3000.5)).toThrow('must be an integer');
  });

  it('should reject non-integer', () => {
    expect(() => validatePort('3000.5')).toThrow('must be an integer');
  });
});
