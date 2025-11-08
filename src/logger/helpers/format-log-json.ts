// src/logger/helpers/build-entry.ts
import { BuildOptions, LogLevel, LogEntry } from '@/common/interfaces';
import { buildEntry, errorMeta, sanitizeLog } from '@/logger/helpers';

/**
 * Orchestrates log entry formatting: build → enrich → sanitize → stringify.
 */
export function formatLogJson(
  level: LogLevel,
  message: unknown,
  opts?: BuildOptions & { error?: unknown },
): string {
  const entry: LogEntry = buildEntry(level, message, opts);

  if (opts?.error) {
    const errMeta = errorMeta(opts.error);
    if (errMeta) {
      Object.assign(entry, errMeta);
    }
  }

  // Sanitize before serialization
  const sanitized = sanitizeLog(entry) as LogEntry;

  try {
    return JSON.stringify(sanitized);
  } catch {
    // Fallback for unserializable entries
    return JSON.stringify({
      ...sanitized,
      message: '[Unserializable]',
      serializationError: true,
    });
  }
}
