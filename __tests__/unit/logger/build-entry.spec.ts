// __tests__/unit/logger/build-entry.spec.ts
import { buildEntry } from '@/logger/helpers/build-entry';
import { RESERVED_LOG_FIELDS, DEFAULT_CONTEXT, NODE_ENV } from '@/common/constants';

describe('buildEntry', () => {
  it('✅ builds a log entry with required fields', () => {
    const message = 'Test log';
    const level = 'INFO' as const;

    const entry = buildEntry(level, message);

    expect(entry.level).toBe(level);
    expect(entry.message).toBe(message); // <-- matches safeSerialize behavior
    expect(entry.context).toBe(DEFAULT_CONTEXT);
    expect(entry.env).toBe(process.env.NODE_ENV ?? NODE_ENV);
    expect(entry.timestamp).toBeDefined();
  });

  it('✅ includes meta fields if provided', () => {
    const meta = { requestId: '123', user: 'alice' };
    const entry = buildEntry('INFO', 'msg', { meta });

    expect(entry.requestId).toBe('123');
    expect(entry.user).toBe('alice');
  });

  it('✅ does not override reserved fields with meta', () => {
    const reservedKey = RESERVED_LOG_FIELDS[0];
    const meta: Record<string, unknown> = { [reservedKey]: 'should be ignored', foo: 'bar' };

    const entry = buildEntry('INFO', 'msg', { meta });

    expect(entry[reservedKey]).not.toBe('should be ignored'); // reserved fields untouched
    expect(entry.foo).toBe('bar');
  });

  it('✅ uses custom context and env when provided', () => {
    const entry = buildEntry('WARN', 'msg', { context: 'MyContext', env: 'test-env' });
    expect(entry.context).toBe('MyContext');
    expect(entry.env).toBe('test-env');
  });

  it('✅ safely handles complex objects as message', () => {
    const obj = { foo: 'bar', nested: { x: 1 } };
    const entry = buildEntry('DEBUG', obj);

    expect(entry.message).toBe(JSON.stringify(obj)); // objects are JSON-stringified
  });
});
