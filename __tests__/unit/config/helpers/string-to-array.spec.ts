// __tests__/unit/config/helpers/string-to-array.spec.ts
import { splitStringToArray } from '@/config/helpers';

describe('splitStringToArray', () => {
  it('splits and trims comma-separated strings', () => {
    expect(splitStringToArray('one,two,three')).toEqual([
      'one',
      'two',
      'three',
    ]);
    expect(splitStringToArray('  one ,  two ,three  ')).toEqual([
      'one',
      'two',
      'three',
    ]);
    expect(splitStringToArray('single')).toEqual(['single']);
  });

  it('returns fallback for undefined or empty strings', () => {
    expect(splitStringToArray(undefined, ['default'])).toEqual(['default']);
    expect(splitStringToArray('', ['default'])).toEqual(['default']);
    expect(splitStringToArray('   ', ['default'])).toEqual(['default']);
    expect(splitStringToArray(undefined)).toEqual([]); // default fallback
  });
});
