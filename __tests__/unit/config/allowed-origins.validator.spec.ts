// __tests__/unit/config/allowed-origins.validator.spec.ts
import { validateOriginUrl, validateAllowedOrigins } from '@/config/validators';

describe('AllowedOriginsValidator', () => {
  describe('validateOriginUrl', () => {
    it('should accept valid https URL', () => {
      expect(validateOriginUrl('https://example.com')).toBe(true);
    });

    it('should accept URL with port', () => {
      expect(validateOriginUrl('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid port', () => {
      expect(() => validateOriginUrl('http://localhost:99999')).toThrow('Invalid port');
    });

    it('should reject empty URL', () => {
      expect(() => validateOriginUrl('')).toThrow('Empty origin URL');
    });

    it('should reject malformed URL', () => {
      expect(() => validateOriginUrl('not-a-url')).toThrow('Invalid URL format');
    });
  });

  describe('validateAllowedOrigins', () => {
    it('should validate comma-separated URLs', () => {
      const result = validateAllowedOrigins('https://example.com,http://localhost:3000');
      expect(result).toBe('https://example.com,http://localhost:3000');
    });

    it('should reject trailing comma', () => {
      expect(() => validateAllowedOrigins('https://example.com,')).toThrow('Empty URL');
    });

    it('should reject empty string', () => {
      expect(validateAllowedOrigins('')).toBe('');
    });
  });
});
