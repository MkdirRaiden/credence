// src/logger/logger.interface.ts
/**
 * Log level hierarchy: ERROR > WARN > INFO > DEBUG > VERBOSE.
 * DEBUG and VERBOSE disabled in production.
 */
export type LogLevel = 'INFO' | 'ERROR' | 'WARN' | 'DEBUG' | 'VERBOSE';

/**
 * Structured log entry in JSON format for aggregation services.
 * Standard fields: timestamp, level, env, context, message.
 * Optional fields for error metadata: name, trace, correlationId, etc.
 *
 */
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
