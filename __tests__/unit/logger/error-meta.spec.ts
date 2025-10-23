//__tests__/unit/logger/error-meta.spec.ts
import { errorMeta } from '@/logger/helpers/error-meta';

describe('errorMeta', () => {
  it('✅ returns trace and name for Error instances', () => {
    const err = new Error('something failed');
    const meta = errorMeta(err);

    expect(meta).toHaveProperty('name', 'Error');
    expect(meta).toHaveProperty('trace');
    expect(typeof meta?.trace).toBe('string');
  });

  it('✅ serializes non-Error input', () => {
    const input = { foo: 'bar' };
    const meta = errorMeta(input);
    expect(meta).toHaveProperty('trace');
    expect(typeof meta?.trace).toBe('string');
  });

  it('✅ returns undefined if no input provided', () => {
    expect(errorMeta()).toBeUndefined();
  });
});
