// __tests__/unit/logger/format-log-json.spec.ts
import { formatLogJson } from '@/logger/helpers/format-log-json';

describe('formatLogJson', () => {
  it('includes basic fields', () => {
    const parsed = JSON.parse(formatLogJson('INFO', 'msg'));
    expect(parsed.level).toBe('INFO');
    expect(parsed.message).toBe('msg');
    expect(parsed.context).toBeDefined();
    expect(parsed.env).toBeDefined();
    expect(parsed.timestamp).toBeDefined();
  });

  it('includes error metadata', () => {
    const err = new Error('fail');
    const parsed = JSON.parse(formatLogJson('ERROR', 'msg', { error: err }));
    expect(parsed.name).toBe('Error');
    expect(parsed.message).toBe('msg'); // Log message should be preserved
    expect(parsed.trace).toContain('fail'); // Error in trace
  });

  it('serializes string, object, and Error correctly', () => {
    const obj = { a: 1 };
    const parsedObj = JSON.parse(formatLogJson('DEBUG', obj));
    expect(parsedObj.message).toBe(JSON.stringify(obj));

    const error = new Error('oops');
    const parsedErr = JSON.parse(formatLogJson('ERROR', error));
    expect(parsedErr.message).toBe('oops');
  });

  it('handles circular references gracefully', () => {
    const circular: any = {};
    circular.self = circular;
    const parsed = JSON.parse(formatLogJson('DEBUG', circular));

    expect(parsed.message).toBe('[Unserializable Object]');
    expect(parsed.timestamp).toBeDefined();
    expect(parsed.level).toBe('DEBUG');
    // The fallback entry should still have required fields
  });

  it('allows custom context and env', () => {
    const parsed = JSON.parse(
      formatLogJson('WARN', 'msg', {
        context: 'MyCTX',
        env: 'test-env',
      }),
    );
    expect(parsed.context).toBe('MyCTX');
    expect(parsed.env).toBe('test-env');
  });

  it('uses default context and env if not provided', () => {
    const parsed = JSON.parse(formatLogJson('INFO', 'msg'));
    expect(parsed.context).toBeDefined();
    expect(parsed.env).toBeDefined();
  });
});
