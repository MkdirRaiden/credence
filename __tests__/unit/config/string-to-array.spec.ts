// __tests__/unit/config/helpers/string-to-array.spec.ts
import { splitStringToArray } from '@/config/helpers/string-to-array';

describe('splitStringToArray', () => {
  it('✅ returns fallback when value is undefined', () => {
    expect(splitStringToArray(undefined, ['default'])).toEqual(['default']);
  });

  it('✅ returns fallback when value is empty string', () => {
    expect(splitStringToArray('', ['default'])).toEqual(['default']);
    expect(splitStringToArray('   ', ['default'])).toEqual(['default']);
  });

  it('✅ splits comma-separated string into array', () => {
    const input = 'one,two,three';
    expect(splitStringToArray(input)).toEqual(['one', 'two', 'three']);
  });

  it('✅ trims spaces around each item', () => {
    const input = '  one ,  two ,three  ';
    expect(splitStringToArray(input)).toEqual(['one', 'two', 'three']);
  });

  it('✅ returns single-item array for string without commas', () => {
    const input = 'single';
    expect(splitStringToArray(input)).toEqual(['single']);
  });

  it('✅ uses empty array as default fallback', () => {
    expect(splitStringToArray(undefined)).toEqual([]);
  });
});
