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
 * @example
 * {
 *   "timestamp": "2025-11-03T12:59:00.000Z",
 *   "level": "ERROR",
 *   "env": "production",
 *   "context": "UserService",
 *   "message": "User not found",
 *   "trace": "Error: User not found\n    at UserService.findById ..."
 * }
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