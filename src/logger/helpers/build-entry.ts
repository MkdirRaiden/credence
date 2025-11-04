// src/logger/helpers/build-entry.ts
import { LogEntry, BuildOptions, LogLevel } from '@/logger/logger.interface';
import { safeSerialize } from '@/logger/helpers';
import { NODE_ENV, DEFAULT_CONTEXT } from '@/common/constants';
import { requestContext } from '@/common/utils/async-storage';

/**
 * Builds structured LogEntry from logging parameters.
 * Automatically includes requestId from AsyncLocalStorage if available.
 */
export function buildEntry(
  level: LogLevel,
  message: unknown,
  opts?: BuildOptions,
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    env: opts?.env ?? process.env.NODE_ENV ?? NODE_ENV,
    context: opts?.context ?? DEFAULT_CONTEXT,
    message: safeSerialize(message),
  };

  // Include requestId for distributed tracing
  const ctx = requestContext.getStore();
  if (ctx?.requestId) {
    entry.requestId = ctx.requestId;
  }

  return entry;
}
