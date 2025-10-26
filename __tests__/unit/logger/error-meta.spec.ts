// __tests__/unit/logger/error-meta.spec.ts
import { errorMeta } from '@/logger/helpers/error-meta';

describe('errorMeta', () => {
  it('✅ returns trace and name for Error', () => {
    const err = new Error('fail');
    const meta = errorMeta(err);
    expect(meta?.trace).toContain('fail');
    expect(meta?.name).toBe('Error');
  });

  it('✅ serializes non-Error input', () => {
    const val = { a: 1 };
    const meta = errorMeta(val);
    expect(meta?.trace).toBe(JSON.stringify(val));
    expect(meta?.name).toBeUndefined();
  });

  it('✅ returns undefined if no input', () => {
    expect(errorMeta()).toBeUndefined();
  });
});
