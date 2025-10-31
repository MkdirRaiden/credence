// __tests__/unit/logger/format-log-json.spec.ts
import { formatLogJson } from '@/logger/helpers/format-log-json';

describe('formatLogJson', () => {
  it('formats basic log with required fields', () => {
    const parsed = JSON.parse(formatLogJson('INFO', 'msg'));

    expect(parsed.level).toBe('INFO');
    expect(parsed.message).toBe('msg');
    expect(parsed.context).toBeDefined();
    expect(parsed.env).toBeDefined();
    expect(parsed.timestamp).toBeDefined();
  });

  it('formats error logs with stack trace', () => {
    const error = new Error('fail');
    const parsed = JSON.parse(formatLogJson('ERROR', 'msg', { error }));

    expect(parsed.name).toBe('Error');
    expect(parsed.message).toBe('msg');
    expect(parsed.trace).toContain('fail');
  });

  it('handles different message types and circular references', () => {
    // Object
    const objParsed = JSON.parse(formatLogJson('DEBUG', { a: 1 }));
    expect(objParsed.message).toBe('{"a":1}');

    // Error
    const errParsed = JSON.parse(formatLogJson('ERROR', new Error('oops')));
    expect(errParsed.message).toBe('oops');

    // Circular
    const circular: any = { self: null };
    circular.self = circular;
    const circularParsed = JSON.parse(formatLogJson('DEBUG', circular));
    expect(circularParsed.message).toBe('[Unserializable Object]');
  });

  it('uses custom context and env when provided', () => {
    const parsed = JSON.parse(
      formatLogJson('WARN', 'msg', { context: 'MyCTX', env: 'test-env' }),
    );

    expect(parsed.context).toBe('MyCTX');
    expect(parsed.env).toBe('test-env');
  });
});
