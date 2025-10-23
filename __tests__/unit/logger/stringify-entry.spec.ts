//__tests__/unit/logger/stringify-entry.spec.ts
import type { LogEntry } from '@/logger/logger.interface';
import { stringifyEntry } from '@/logger/helpers/stringify-entry';

describe('stringifyEntry', () => {
  const baseEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'INFO', // ✅ LogLevel type
    env: 'test',
    context: 'MyContext',
    message: 'Hello world',
  };

  it('✅ returns JSON string for a valid entry', () => {
    const result = stringifyEntry(baseEntry);
    expect(typeof result).toBe('string');
    const parsed = JSON.parse(result);
    expect(parsed.level).toBe('INFO');
    expect(parsed.message).toBe('Hello world');
  });

  it('✅ handles circular structures gracefully', () => {
    const circularEntry: any = { ...baseEntry };
    circularEntry.self = circularEntry; // circular reference

    const result = stringifyEntry(circularEntry);
    expect(typeof result).toBe('string');

    const parsed = JSON.parse(result);
    expect(parsed.truncatedMeta).toBe(true);
    expect(parsed.timestamp).toBe(baseEntry.timestamp);
    expect(parsed.level).toBe(baseEntry.level);
    expect(parsed.message).toBe(baseEntry.message);
  });
});
