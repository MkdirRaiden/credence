//__tests__/unit/logger/safe-serialize.spec.ts
import { safeSerialize } from '@/logger/helpers/safe-serialize';

describe('safeSerialize', () => {
  it('✅ returns the string unchanged', () => {
    const input = 'hello world';
    expect(safeSerialize(input)).toBe('hello world');
  });

  it('✅ converts Error instances to their message', () => {
    const error = new Error('something went wrong');
    expect(safeSerialize(error)).toBe('something went wrong');
  });

  it('✅ serializes plain objects to JSON string', () => {
    const obj = { foo: 'bar', count: 2 };
    expect(safeSerialize(obj)).toBe(JSON.stringify(obj));
  });

  it('✅ returns string for unserializable objects', () => {
    const circular: any = {};
    circular.self = circular;
    expect(typeof safeSerialize(circular)).toBe('string'); // fallback
  });
});
