// src/logger/helpers/format-log-json.ts
import { LogLevel, BuildOptions } from '@/logger/logger.interface';
import { buildEntry } from './build-entry';
import { errorMeta } from './error-meta';

export function formatLogJson(
  level: LogLevel,
  message: unknown,
  opts?: BuildOptions & { error?: unknown },
): string {
  const entry = buildEntry(level, message, opts);
  
  // Add error metadata if present
  if (opts?.error) {
    const errMeta = errorMeta(opts.error);
    if (errMeta) {
      Object.assign(entry, errMeta);
    }
  }

  try {
    return JSON.stringify(entry);
  } catch {
    return JSON.stringify({
      ...entry,
      message: '[Unserializable]',
      serializationError: true,
    });
  }
}
