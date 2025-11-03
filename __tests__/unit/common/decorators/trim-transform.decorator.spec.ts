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
    const input = {
      name: '  hello world  ',
      count: 42,
      optional: '\t  spaced  \n',
    };

    const result = plainToClass(TestDTO, input);

    expect(result.name).toBe('hello world');
    expect(result.count).toBe(42);
    expect(result.optional).toBe('spaced');
  });

  it('handles empty strings', () => {
    const input = {
      name: '   ',
      count: 0,
    };

    const result = plainToClass(TestDTO, input);

    expect(result.name).toBe('');
  });

  it('leaves non-string values unchanged', () => {
    const input = {
      name: 'test',
      count: 123,
    };

    const result = plainToClass(TestDTO, input);

    expect(result.count).toBe(123);
    expect(typeof result.count).toBe('number');
  });
});
