// __tests__/unit/common/pipes/parse-uuid.pipe.spec.ts
import { ParseUuidPipe } from '@/common/pipes/parse-uuid.pipe';
import { BadRequestException } from '@nestjs/common';


describe('ParseUuidPipe', () => {
  let pipe: ParseUuidPipe;

  beforeEach(() => {
    pipe = new ParseUuidPipe();
  });

  it('accepts valid UUIDs (v1, v4, case-insensitive)', () => {
    const validUuids = [
      '550e8400-e29b-41d4-a716-446655440000', // v4
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8', // v1
      '550E8400-E29B-41D4-A716-446655440000', // uppercase
    ];

    validUuids.forEach((uuid) => {
      expect(pipe.transform(uuid)).toBe(uuid);
    });
  });

  it('rejects invalid UUID formats', () => {
    const invalidUuids = [
      '550e8400e29b41d4a716446655440000',      // no hyphens
      '550e8400-e29b-41d4-a716',               // wrong length
      '550e8400-e29b-41d4-a716-446655440zzz', // non-hex chars
      '',                                       // empty
      '550e8400-e29b-41d4-a716-44665544000',  // missing digit
    ];

    invalidUuids.forEach((uuid) => {
      expect(() => pipe.transform(uuid)).toThrow(BadRequestException);
    });
  });

  it('includes value in error message', () => {
    expect(() => pipe.transform('invalid')).toThrow('Invalid UUID: invalid');
  });
});
