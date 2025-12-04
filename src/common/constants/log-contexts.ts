import { REQUEST } from "@nestjs/core";

// src/common/constants/log-constants.ts
export const LOG_CONTEXTS = {
  // Core system
  APP: 'App',
  BOOTSTRAP: 'Bootstrap',
  CONFIG: 'Config',
  HEALTH: 'Health',

  // Infrastructure
  DATABASE: 'Database',
  PRISMA: 'Prisma',

  // Features  
  AUTH: 'Auth',
  USER: 'User',
  REFRESH_TOKEN: 'RefreshToken',

  // HTTP/Middleware
  GUARD: 'Guard',
  INTERCEPTOR: 'Interceptor',
  FILTER: 'Filter',
  REQUEST: 'Request',

  // Others
  RETRY: 'Retry',
  SHUTDOWN: 'Shutdown',

} as const;

