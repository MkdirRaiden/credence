// src/logger/helpers/index.ts
import type { LogLevel, BuildOptions } from '../logger.interface';
import { stringifyEntry } from './stringify-entry';
import { buildEntry } from './build-entry';
import { errorMeta } from './error-meta';

export type { LogLevel, BuildOptions };

// Generic formatter for all levels, including 'ERROR'.
// - opts.error: optional Error/trace to attach { trace, name }
export function formatLogJson(
  level: LogLevel,
  message: unknown,
  opts?: BuildOptions & { error?: unknown },
): string {
  const meta = {
    ...(opts?.meta ?? {}),
    ...(opts?.error ? (errorMeta(opts.error) ?? {}) : {}),
  };
  return stringifyEntry(
    buildEntry(level, message, {
      ...opts,
      meta,
    }),
  );
}
