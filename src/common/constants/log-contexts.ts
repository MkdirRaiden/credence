// src/common/constants/log-constants.ts
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
  REFRESH_TOKEN: 'RefreshToken',
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
