// __tests__/unit/config/validators/validate-jwt-secret.spec.ts
import { validateJwtSecret } from '@/config/validators';


describe('validateJwtSecret', () => {
  it('should accept valid strong secret', () => {
    const secret = 'aB3xY9mK2pL5qRsT8vW1nO4jU6hG7fD0eC';
    expect(validateJwtSecret(secret)).toBe(secret);
  });


  it('should reject secret shorter than 32 chars', () => {
    expect(() => validateJwtSecret('short-secret')).toThrow(
      'must be at least 32 characters',
    );
  });


  it('should reject empty secret', () => {
    expect(() => validateJwtSecret('')).toThrow('cannot be empty');
  });


  it('should reject weak patterns: password', () => {
    const weak = 'password' + 'a'.repeat(24); // 32 chars but weak pattern
    expect(() => validateJwtSecret(weak)).toThrow('too weak');
  });


  it('should reject weak patterns: all lowercase and numbers (exactly 32)', () => {
    const weak = 'abcdefghijklmnopqrstuvwxyz012345'; // Exactly 32 lowercase/numbers
    expect(() => validateJwtSecret(weak)).toThrow('too weak');
  });


  it('should reject repeated characters', () => {
    const weak = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'; // 34 a's
    expect(() => validateJwtSecret(weak)).toThrow('too weak');
  });


  it('should trim whitespace', () => {
    const secret = '  aB3xY9mK2pL5qRsT8vW1nO4jU6hG7fD0eC  ';
    expect(validateJwtSecret(secret)).toBe(secret);
  });
});
