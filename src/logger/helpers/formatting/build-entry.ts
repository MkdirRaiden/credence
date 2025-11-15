// src/logger/helpers/formatting/build-entry.ts
import { LogEntry, BuildOptions, LogLevel } from '@/common/interfaces';
import { safeSerialize } from '@/logger/helpers';
import { LOG_CONTEXTS } from '@/common/constants';
import { NODE_ENV } from '@/common/constants';
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
    context: opts?.context ?? LOG_CONTEXTS.APP,
    message: safeSerialize(message),
  };

  const ctx = requestContext.getStore();
  if (ctx?.requestId) {
    entry.requestId = ctx.requestId;
  }

  return entry;
}
