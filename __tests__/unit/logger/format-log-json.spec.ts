// __tests__/unit/logger/format-log-json.spec.ts
import { formatLogJson } from '@/logger/helpers/format-log-json';
import { RESERVED_LOG_FIELDS } from '@/common/constants';

describe('formatLogJson', () => {
  it('basic fields', () => {
    const parsed = JSON.parse(formatLogJson('INFO', 'msg'));
    expect(parsed.level).toBe('INFO');
    expect(parsed.message).toBe('msg');
    expect(parsed.context).toBeDefined();
    expect(parsed.env).toBeDefined();
    expect(parsed.timestamp).toBeDefined();
  });

  it('merges meta correctly and ignores reserved', () => {
    const meta = { requestId: '123', [RESERVED_LOG_FIELDS[0]]: 'ignore' };
    const parsed = JSON.parse(formatLogJson('INFO', 'msg', { meta }));
    expect(parsed.requestId).toBe('123');
    expect(parsed[RESERVED_LOG_FIELDS[0]]).not.toBe(meta[RESERVED_LOG_FIELDS[0]]);
  });

  it('includes error metadata', () => {
    const err = new Error('fail');
    const parsed = JSON.parse(formatLogJson('ERROR', 'msg', { error: err }));
    expect(parsed.trace).toContain('fail');
    expect(parsed.name).toBe('Error');
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

    // fallback message used
    expect(parsed.message).toBe('[Unserializable Object]');
    expect(parsed.timestamp).toBeDefined();
    expect(parsed.level).toBe('DEBUG');
  });

  it('allows custom context/env', () => {
    const parsed = JSON.parse(formatLogJson('WARN', 'msg', {
      context: 'MyCTX',
      env: 'test-env',
    }));
    expect(parsed.context).toBe('MyCTX');
    expect(parsed.env).toBe('test-env');
  });

  it('uses default context/env if not provided', () => {
    const parsed = JSON.parse(formatLogJson('INFO', 'msg'));
    expect(parsed.context).toBeDefined();
    expect(parsed.env).toBeDefined();
  });
});
