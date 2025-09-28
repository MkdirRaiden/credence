// src/logger/logger.util.ts
import { DEFAULT_CONTEXT, DEFAULT_ENV } from '../constants';

type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG' | 'VERBOSE';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  env: string;
  context: string;
  message: string;
  [key: string]: any; // optional extra metadata (e.g., requestId, userId)
}

export function formatMessage(
  level: LogLevel,
  message: string,
  context?: string,
  env?: string
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    env: env || DEFAULT_ENV,
    context: context || DEFAULT_CONTEXT,
    message,
  };
}
