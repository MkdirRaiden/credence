// src/common/interfaces/app-config.interface.ts
import { LogLevel } from '@/common/interfaces';
export interface AppConfig {
  server: {
    nodeEnv: string;
    port: number;
    host: string;
    globalPrefix: string;
    allowedOrigins: string[];
    excludePrefixArray: string[];
  };
  app: {
    appName: string;
    appVersion: string;
    logLevel: LogLevel;
  };
  database: {
    url: string;
    maxRetries: number;
    retryDelays: number;
    healthCheckIntervalMs: number;
    probeCheckTimeoutMs: number;
  };
  jwt: {
    jwtSecret: string;
    jwtRefreshSecret: string;
    jwtExpiration: number;
    jwtRefreshExpiration: number;
  };
}
