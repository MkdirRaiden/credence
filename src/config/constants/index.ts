// src/config/constants/index.ts
export * from '@/config/constants/critical-config';
export * from '@/config/constants/server-config';
export * from '@/config/constants/application-config';

// Environment-specific config
export const ENV_CONFIG = {
  development: {
    allowUnknown: true,
    message: 'Unknown environment variable: {#label}',
  },
  test: {
    allowUnknown: true,
    message: 'Unknown environment variable: {#label}',
  },
  production: {
    allowUnknown: false,
    message: 'Unknown environment variable: {#label}',
  },
} as const;
