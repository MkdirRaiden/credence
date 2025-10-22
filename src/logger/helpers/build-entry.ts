// src/logger/helpers/build-entry.ts
import { safeSerialize } from '@/logger/helpers/safe-serialize';
import { LogEntry, LogLevel, BuildOptions } from '@/logger/logger.interface';
import {
  DEFAULT_CONTEXT,
  NODE_ENV,
  RESERVED_LOG_FIELDS,
} from '@/common/constants';

// Make a Set for fast lookup of reserved keys
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

  // Base log entry
  const base: LogEntry & Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    env: env ?? process.env.NODE_ENV ?? defaultEnv,
    context: context ?? defaultContext,
    message: safeSerialize(message),
  };

  // Safely add meta fields that are not reserved
  if (meta) {
    Object.entries(meta).forEach(([key, value]) => {
      if (!RESERVED.has(key)) {
        base[key] = value;
      }
    });
  }

  return base;
}
