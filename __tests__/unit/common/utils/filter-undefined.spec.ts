// __tests__/unit/common/utils/filter-undefined.spec.ts
import { filterUndefined } from '@/common/utils';

describe('filterUndefined Utility', () => {
  it('removes undefined and null, preserves falsy values', () => {
    const input = {
      id: 1,
      name: 'test',
      count: 0,
      flag: false,
      text: '',
      email: undefined,
      phone: null,
    };

    const result = filterUndefined(input);

    expect(result).toEqual({
      id: 1,
      name: 'test',
      count: 0,
      flag: false,
      text: '',
    });
  });

  it('handles empty and all-undefined objects', () => {
    expect(filterUndefined({})).toEqual({});
    expect(filterUndefined({ a: undefined, b: null })).toEqual({});
  });

  it('preserves nested objects (shallow filtering only)', () => {
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
