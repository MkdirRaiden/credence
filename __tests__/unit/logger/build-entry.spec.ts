// __tests__/unit/logger/build-entry.spec.ts
import { buildEntry } from '@/logger/helpers/build-entry';
import { RESERVED_LOG_FIELDS, DEFAULT_CONTEXT, NODE_ENV } from '@/common/constants';

describe('buildEntry', () => {
  it('✅ includes base fields', () => {
    const entry = buildEntry('INFO', 'msg');
    expect(entry.level).toBe('INFO');
    expect(entry.message).toBe('msg');
    expect(entry.context).toBe(DEFAULT_CONTEXT);
    expect(entry.env).toBe(process.env.NODE_ENV ?? NODE_ENV);
    expect(entry.timestamp).toBeDefined();
  });

  it('✅ merges meta but preserves reserved fields', () => {
    const reservedKey = RESERVED_LOG_FIELDS[0]; // e.g., "timestamp"
    const meta = { foo: 'bar', [reservedKey]: 'ignore' };
    const entry = buildEntry('INFO', 'msg', { meta });

    expect(entry.foo).toBe('bar');
    expect(entry[reservedKey]).not.toBe(meta[reservedKey]); // reserved not overwritten
  });

  it('✅ supports custom context and env', () => {
    const entry = buildEntry('WARN', 'msg', { context: 'CTX', env: 'test' });
    expect(entry.context).toBe('CTX');
    expect(entry.env).toBe('test');
  });
});
