// src/logger/constants
/**
 * Standard log contexts for consistent logging across the application
 */
export const LOG_CONTEXTS = {
  // Core system
  APP: 'App',
  BOOTSTRAP: 'Bootstrap',
  CONFIG: 'Config',
  RETRY: 'Retry',
  SHUTDOWN: 'Shutdown',

  // Infrastructure
  DATABASE: 'Database',
  PRISMA: 'Prisma',
  CACHE: 'Cache',
  QUEUE: 'Queue',

  // Features
  AUTH: 'Auth',
  USER: 'User',
  RERESH_TOKEN: 'RefreshToken',
  REFERRAL: 'Referral',
  CREDIT: 'Credit',
  OTP: 'OTP',

  // Monitoring
  HEALTH: 'Health',
  METRICS: 'Metrics',

  // HTTP
  REQUEST: 'Request',
  RESPONSE: 'Response',
  MIDDLEWARE: 'Middleware',
  GUARD: 'Guard',
  INTERCEPTOR: 'Interceptor',
  FILTER: 'Filter',
} as const;

export type LogContext = (typeof LOG_CONTEXTS)[keyof typeof LOG_CONTEXTS];

export const SENSITIVE_FIELDS = [
  'password',
  'passwordHash',
  'newPassword',
  'oldPassword',
  'confirmPassword',
  'token',
  'accessToken',
  'refreshToken',
  'idToken',
  'secret',
  'apiKey',
  'apiSecret',
  'authorization',
  'cookie',
  'sessionId',
  'creditCard',
  'cardNumber',
  'cvv',
  'ssn',
  'otp',
  'code',
] as const;
