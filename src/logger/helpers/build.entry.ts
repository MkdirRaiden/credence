// src/logger/helpers/build.entry.ts
import { safeSerialize } from '@/logger/helpers/safe.serialize';
import { LogEntry, LogLevel, BuildOptions } from '@/logger/logger.interfaces';
import { DEFAULT_CONTEXT, NODE_ENV, RESERVED_LOG_FIELDS } from '@/common/constants';

const RESERVED = new Set(RESERVED_LOG_FIELDS);

export function buildEntry(
  level: LogLevel,
  message: unknown,
  opts?: BuildOptions,
): LogEntry {
  const {
    context,
    env,
    meta,
    defaultContext = DEFAULT_CONTEXT,
    defaultEnv = NODE_ENV,
  } = opts ?? {};
  const base: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    env: env ?? process.env.NODE_ENV ?? defaultEnv,
    context: context ?? defaultContext,
    message: safeSerialize(message),
  };
  if (meta) {
    for (const [k, v] of Object.entries(meta)) {
      if (!RESERVED.has(k)) (base as any)[k] = v;
    }
  }
  return base;
}
