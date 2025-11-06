// src/logger/helpers/build-entry.ts
import { LogEntry, BuildOptions, LogLevel } from '@/logger/logger.interface';
import { safeSerialize } from '@/logger/helpers';
import { DEFAULT_CONTEXT } from '@/common/constants';
import { NODE_ENV } from '@/config/constants';
import { requestContext } from '@/common/utils';

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
    env: opts?.env ?? NODE_ENV,
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
