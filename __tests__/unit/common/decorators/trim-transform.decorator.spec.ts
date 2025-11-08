// __tests__/unit/common/decorators/trim-transform.decorator.spec.ts
import { plainToClass } from 'class-transformer';
import { TrimTransform } from '@/common/decorators/trim-transform.decorator';

class TestDTO {
  @TrimTransform
  name: string;

  @TrimTransform
  count: number;

  @TrimTransform
  optional?: string;
}

describe('TrimTransform Decorator', () => {
  it('trims whitespace from strings', () => {
    const result = plainToClass(TestDTO, {
      name: '  hello world  ',
      optional: '\t  spaced  \n',
      count: 42,
    });

    expect(result.name).toBe('hello world');
    expect(result.optional).toBe('spaced');
  });

  it('handles empty and whitespace-only strings', () => {
    const result = plainToClass(TestDTO, {
      name: '   ',
      count: 0,
    });

    expect(result.name).toBe('');
  });

  it('leaves non-string values unchanged', () => {
    const result = plainToClass(TestDTO, {
      name: 'test',
      count: 123,
      optional: null,
    });

    expect(result.count).toBe(123);
    expect(result.optional).toBeNull();
  });

  it('preserves internal whitespace', () => {
    const result = plainToClass(TestDTO, {
      name: '  hello   world  ',
      count: 0,
    });

    expect(result.name).toBe('hello   world');
  });
});
