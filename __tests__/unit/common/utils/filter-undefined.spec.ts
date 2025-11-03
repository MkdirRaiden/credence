// __tests__/unit/common/utils/filter-undefined.spec.ts
import { filterUndefined } from '@/common/utils/filter-undefined';

describe('filterUndefined utility', () => {
  it('removes undefined and null values', () => {
    const input = {
      id: 1,
      name: 'test',
      email: undefined,
      phone: null,
      age: 0,
      active: false,
    };

    const result = filterUndefined(input);

    expect(result).toEqual({
      id: 1,
      name: 'test',
      age: 0,
      active: false,
    });
    expect(result.email).toBeUndefined();
    expect(result.phone).toBeUndefined();
  });

  it('handles empty object', () => {
    const result = filterUndefined({});
    expect(result).toEqual({});
  });

  it('handles all undefined/null values', () => {
    const input = {
      a: undefined,
      b: null,
      c: undefined,
    };

    const result = filterUndefined(input);
    expect(result).toEqual({});
  });

  it('preserves falsy values (0, false, empty string)', () => {
    const input = {
      count: 0,
      flag: false,
      text: '',
      description: 'hello',
      missing: undefined,
    };

    const result = filterUndefined(input);

    expect(result).toEqual({
      count: 0,
      flag: false,
      text: '',
      description: 'hello',
    });
  });

  it('handles nested objects (shallow filtering)', () => {
    const input = {
      user: { id: 1, name: 'test' },
      empty: undefined,
      config: null,
    };

    const result = filterUndefined(input);

    expect(result).toEqual({
      user: { id: 1, name: 'test' },
    });
  });
});
