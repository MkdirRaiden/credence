// __tests__/unit/logger/build-entry.spec.ts
import { buildEntry } from '@/logger/helpers/build-entry';
import { requestContext } from '@/common/utils/async-storage';
import { DEFAULT_CONTEXT, NODE_ENV } from '@/common/constants';

describe('buildEntry', () => {
  it('includes base fields with defaults and custom values', () => {
    requestContext.run({}, () => {
      const defaultEntry = buildEntry('INFO', 'msg');
      expect(defaultEntry.level).toBe('INFO');
      expect(defaultEntry.message).toBe('msg');
      expect(defaultEntry.context).toBe(DEFAULT_CONTEXT);
      expect(defaultEntry.env).toBe(process.env.NODE_ENV ?? NODE_ENV);
      expect(defaultEntry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);

      const customEntry = buildEntry('WARN', 'msg', {
        context: 'CTX',
        env: 'test',
      });
      expect(customEntry.context).toBe('CTX');
      expect(customEntry.env).toBe('test');
    });
  });

  it('serializes objects in message', () => {
    requestContext.run({}, () => {
      const entry = buildEntry('DEBUG', { foo: 'bar' });
      expect(entry.message).toBe('{"foo":"bar"}');
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
});
