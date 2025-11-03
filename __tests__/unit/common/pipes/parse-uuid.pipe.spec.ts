// __tests__/unit/common/pipes/parse-uuid.pipe.spec.ts
import { ParseUuidPipe } from '@/common/pipes/parse-uuid.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ParseUuidPipe', () => {
  let pipe: ParseUuidPipe;

  beforeEach(() => {
    pipe = new ParseUuidPipe();
  });

  describe('transform', () => {
    it('accepts valid UUID v4', () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = pipe.transform(uuid);
      expect(result).toBe(uuid);
    });

    it('accepts valid UUID v1', () => {
      const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const result = pipe.transform(uuid);
      expect(result).toBe(uuid);
    });

    it('accepts uppercase UUIDs', () => {
      const uuid = '550E8400-E29B-41D4-A716-446655440000';
      const result = pipe.transform(uuid);
      expect(result).toBe(uuid);
    });

    it('rejects invalid format (no hyphens)', () => {
      expect(() => pipe.transform('550e8400e29b41d4a716446655440000')).toThrow(
        BadRequestException,
      );
    });

    it('rejects invalid format (wrong length)', () => {
      expect(() => pipe.transform('550e8400-e29b-41d4-a716')).toThrow(
        BadRequestException,
      );
    });

    it('rejects invalid format (non-hex characters)', () => {
      expect(() => pipe.transform('550e8400-e29b-41d4-a716-446655440zzz')).toThrow(
        BadRequestException,
      );
    });

    it('rejects empty string', () => {
      expect(() => pipe.transform('')).toThrow(BadRequestException);
    });
  });
});
