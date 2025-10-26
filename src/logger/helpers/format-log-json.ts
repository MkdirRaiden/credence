// src/logger/helpers/format-log-json.ts
import { LogLevel, BuildOptions } from '@/logger/logger.interface';
import { buildEntry } from './build-entry';
import { errorMeta } from './error-meta';

/** Main formatter: builds JSON log string */
export function formatLogJson(level: LogLevel, message: unknown, opts?: BuildOptions & { error?: unknown }): string {
  const meta = {
    ...(opts?.meta ?? {}),
    ...(opts?.error ? errorMeta(opts.error) ?? {} : {}),
  };

  const entry = buildEntry(level, message, { ...opts, meta });

  try {
    return JSON.stringify(entry);
  } catch {
    return JSON.stringify({ ...entry, message: '[Unserializable]', truncatedMeta: true });
  }
}
