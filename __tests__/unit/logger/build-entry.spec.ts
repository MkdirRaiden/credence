// __tests__/unit/logger/build-entry.spec.ts
import { buildEntry } from '@/logger/helpers/build-entry';
import { DEFAULT_CONTEXT, NODE_ENV } from '@/common/constants';

describe('buildEntry', () => {
  it('includes base fields', () => {
    const entry = buildEntry('INFO', 'msg');
    expect(entry.level).toBe('INFO');
    expect(entry.message).toBe('msg');
    expect(entry.context).toBe(DEFAULT_CONTEXT);
    expect(entry.env).toBe(process.env.NODE_ENV ?? NODE_ENV);
    expect(entry.timestamp).toBeDefined();
  });

  it('supports custom context and env', () => {
    const entry = buildEntry('WARN', 'msg', { context: 'CTX', env: 'test' });
    expect(entry.context).toBe('CTX');
    expect(entry.env).toBe('test');
  });

  it('uses safeSerialize for message', () => {
    const obj = { foo: 'bar' };
    const entry = buildEntry('DEBUG', obj);
    expect(entry.message).toBe('{"foo":"bar"}');
  });

  it('generates ISO timestamp', () => {
    const entry = buildEntry('ERROR', 'test');
    expect(entry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
