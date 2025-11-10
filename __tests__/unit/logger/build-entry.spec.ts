// __tests__/unit/logger/build-entry.spec.ts
import { buildEntry } from '@/logger/helpers';
import { LOG_CONTEXTS } from '@/common/constants';
import { requestContext } from '@/common/utils';

describe('buildEntry', () => {
  it('includes base fields with defaults and custom values', () => {
    requestContext.run({}, () => {
      const defaultEntry = buildEntry('INFO', 'msg');

      expect(defaultEntry.level).toBe('INFO');
      expect(defaultEntry.message).toBe('msg');
      expect(defaultEntry.context).toBe('App');
      expect(defaultEntry.env).toBeDefined();
      expect(defaultEntry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);

      const customEntry = buildEntry('WARN', 'msg', {
        context: LOG_CONTEXTS.DATABASE,
        env: 'test',
      });

      expect(customEntry.context).toBe('Database');
      expect(customEntry.env).toBe('test');
    });
  });

  it('converts message to string using safeSerialize', () => {
    requestContext.run({}, () => {
      // Object - JSON stringified
      const objEntry = buildEntry('DEBUG', { foo: 'bar' });
      expect(objEntry.message).toBe('{"foo":"bar"}');

      // Number
      const numEntry = buildEntry('INFO', 123);
      expect(numEntry.message).toBe('123');

      // Boolean
      const boolEntry = buildEntry('WARN', true);
      expect(boolEntry.message).toBe('true');

      // String stays as-is
      const strEntry = buildEntry('INFO', 'hello');
      expect(strEntry.message).toBe('hello');
    });
  });

  it('includes requestId when available in context', () => {
    requestContext.run({ requestId: 'req_123' }, () => {
      const entry = buildEntry('INFO', 'msg');
      expect(entry.requestId).toBe('req_123');
    });
  });

  it('omits requestId when context is empty', () => {
    requestContext.run({}, () => {
      const entry = buildEntry('INFO', 'msg');
      expect(entry.requestId).toBeUndefined();
    });
  });

  it('uses typed log context constants', () => {
    requestContext.run({}, () => {
      const authEntry = buildEntry('INFO', 'msg', {
        context: LOG_CONTEXTS.AUTH,
      });
      expect(authEntry.context).toBe('Auth');

      const dbEntry = buildEntry('ERROR', 'msg', {
        context: LOG_CONTEXTS.DATABASE,
      });
      expect(dbEntry.context).toBe('Database');

      const healthEntry = buildEntry('DEBUG', 'msg', {
        context: LOG_CONTEXTS.HEALTH,
      });
      expect(healthEntry.context).toBe('Health');
    });
  });

  it('handles undefined message gracefully', () => {
    requestContext.run({}, () => {
      const entry = buildEntry('INFO', undefined);
      expect(entry.message).toBeUndefined(); // FIXED
    });
  });

  it('handles null message gracefully', () => {
    requestContext.run({}, () => {
      const entry = buildEntry('INFO', null);
      expect(entry.message).toBe('null');
    });
  });

  it('generates ISO 8601 timestamp', () => {
    requestContext.run({}, () => {
      const entry = buildEntry('INFO', 'msg');
      const timestamp = new Date(entry.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toISOString()).toBe(entry.timestamp);
    });
  });

  it('uses NODE_ENV constant as fallback for env', () => {
    requestContext.run({}, () => {
      const entry = buildEntry('INFO', 'msg');
      expect(entry.env).toBe('development');
    });
  });

  it('handles circular references in objects', () => {
    requestContext.run({}, () => {
      const circular: any = { name: 'test' };
      circular.self = circular;

      const entry = buildEntry('DEBUG', circular);
      // safeSerialize returns fallback for circular refs
      expect(entry.message).toBe('[Unserializable Object]'); // FIXED
    });
  });
});
