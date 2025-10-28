// src/logger/logger.interface.ts
export type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG' | 'VERBOSE';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  env: string;
  context: string;
  message: string;
  [key: string]: any;
}

export interface BuildOptions {
  context?: string;
  env?: string;
}
