// __tests__/unit/logger/error-meta.spec.ts
import { errorMeta } from '@/logger/helpers/error-meta';

describe('errorMeta', () => {
  it('returns name and trace for Error', () => {
    const err = new Error('fail');
    const meta = errorMeta(err);
    expect(meta?.name).toBe('Error');
    expect(meta?.trace).toContain('fail');
  });

  it('serializes non-Error input', () => {
    const val = { a: 1 };
    const meta = errorMeta(val);
    expect(meta?.trace).toBe(JSON.stringify(val));
  });

  it('returns undefined if no input', () => {
    expect(errorMeta()).toBeUndefined();
    expect(errorMeta(null)).toBeUndefined();
  });
});
