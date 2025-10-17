// src/logger/helpers/stringify-entry.ts
import type { LogEntry } from '@/logger/logger.interface';

export function stringifyEntry(entry: LogEntry): string {
  try {
    return JSON.stringify(entry);
  } catch {
    const { timestamp, level, env, context, message } = entry;
    return JSON.stringify({
      timestamp,
      level,
      env,
      context,
      message,
      truncatedMeta: true,
    });
  }
}
