// __tests__/unit/logger/format-log-json.spec.ts
import { formatLogJson } from '@/logger/helpers';
import { LogLevel } from '@/logger/logger.interface';

describe('formatLogJson', () => {
  const message = 'Test log message';

  it('✅ returns a valid JSON string with required fields', () => {
    const level: LogLevel = 'INFO';
    const result = formatLogJson(level, message);

    const parsed = JSON.parse(result);
    expect(parsed.level).toBe(level);
    expect(parsed.message).toBe(message);
    expect(parsed.context).toBeDefined();
    expect(parsed.env).toBeDefined();
    expect(parsed.timestamp).toBeDefined();
  });

  it('✅ merges meta and error metadata if provided', () => {
    const level: LogLevel = 'ERROR';
    const error = new Error('Something broke');
    const meta = { requestId: 'abc123' };

    const result = formatLogJson(level, message, { meta, error });
    const parsed = JSON.parse(result);

    expect(parsed.requestId).toBe('abc123');       // meta merged
    expect(parsed.trace).toContain('Something broke'); // errorMeta merged
    expect(parsed.name).toBe('Error');             // errorMeta name
  });

  it('✅ handles absence of meta and error gracefully', () => {
    const level: LogLevel = 'WARN';
    const result = formatLogJson(level, message);
    const parsed = JSON.parse(result);

    expect(parsed.level).toBe(level);
    expect(parsed.message).toBe(message);
    expect(parsed.trace).toBeUndefined();
    expect(parsed.name).toBeUndefined();
  });
});
