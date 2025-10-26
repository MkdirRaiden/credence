// src/logger/helpers/build-entry.ts
import { LogEntry, BuildOptions, LogLevel } from '@/logger/logger.interface';
import { safeSerialize } from './safe-serialize';
import { NODE_ENV, DEFAULT_CONTEXT, RESERVED_LOG_FIELDS } from '@/common/constants';

const RESERVED = new Set(RESERVED_LOG_FIELDS);

export function buildEntry(level: LogLevel, message: unknown, opts?: BuildOptions): LogEntry & Record<string, unknown> {
  const base: LogEntry & Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    env: opts?.env ?? process.env.NODE_ENV ?? NODE_ENV,
    context: opts?.context ?? DEFAULT_CONTEXT,
    message: safeSerialize(message),
  };

  if (opts?.meta) {
    Object.entries(opts.meta).forEach(([k, v]) => {
      if (!RESERVED.has(k)) base[k] = v;
    });
  }

  return base;
}
