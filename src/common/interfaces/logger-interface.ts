// src/common/interfaces/logger-interface.ts
export type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'VERBOSE';
import { LogContext } from '@/logger/constants';

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
