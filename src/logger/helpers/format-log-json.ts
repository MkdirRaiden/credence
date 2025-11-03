// src/logger/helpers/format-log-json.ts
import { LogLevel, BuildOptions } from '@/logger/logger.interface';
import { buildEntry, errorMeta } from '@/logger/helpers';

/**
 * Orchestrates log entry formatting: build → enrich → stringify.
 */
export function formatLogJson(
  level: LogLevel,
  message: unknown,
  opts?: BuildOptions & { error?: unknown },
): string {
  const entry = buildEntry(level, message, opts);

  if (opts?.error) {
    const errMeta = errorMeta(opts.error);
    if (errMeta) {
      Object.assign(entry, errMeta);
    }
  }

  try {
    return JSON.stringify(entry);
  } catch {
    // Fallback for unserializable entries
    return JSON.stringify({
      ...entry,
      message: '[Unserializable]',
      serializationError: true,
    });
  }
}
