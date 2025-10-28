// src/logger/helpers/build-entry.ts
import { LogEntry, BuildOptions, LogLevel } from '@/logger/logger.interface';
import { safeSerialize } from './safe-serialize';
import { NODE_ENV, DEFAULT_CONTEXT } from '@/common/constants';

export function buildEntry(
  level: LogLevel,
  message: unknown,
  opts?: BuildOptions,
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    env: opts?.env ?? process.env.NODE_ENV ?? NODE_ENV,
    context: opts?.context ?? DEFAULT_CONTEXT,
    message: safeSerialize(message),
  };
}
