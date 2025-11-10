// src/common/interfaces/logger-interface.ts
import { LOG_CONTEXTS } from '@/common/constants';

export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'VERBOSE';

export type LogContext = (typeof LOG_CONTEXTS)[keyof typeof LOG_CONTEXTS];

// Log level hierarchy for filtering
export const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  VERBOSE: 4,
};

export function shouldLog(currentLevel: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[currentLevel] <= LOG_LEVEL_PRIORITY[minLevel];
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  env: string;
  context: string;
  message: string;
  [key: string]: any;
}

export interface BuildOptions {
  context?: LogContext;
  env?: string;
  requestId?: string;
}
