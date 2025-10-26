// __tests__/unit/logger/safe-serialize.spec.ts
import { safeSerialize } from '@/logger/helpers/safe-serialize';

describe('safeSerialize', () => {
  it('✅ returns string unchanged', () => {
    expect(safeSerialize('hello')).toBe('hello');
  });

  it('✅ converts Error to message', () => {
    const err = new Error('oops');
    expect(safeSerialize(err)).toBe('oops');
  });

  it('✅ serializes objects to JSON', () => {
    const obj = { foo: 1 };
    expect(safeSerialize(obj)).toBe(JSON.stringify(obj));
  });

  it('✅ returns fallback for circular objects', () => {
    const circular: any = {};
    circular.self = circular;
    const result = safeSerialize(circular);
    expect(result).toBe('[Unserializable Object]');
  });
});
