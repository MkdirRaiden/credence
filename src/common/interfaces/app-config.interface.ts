// src/common/interfaces/app-config.interface.ts
export interface AppConfig {
  nodeEnv: string;
  port: number;
  appName: string;
  appVersion: string;
  host: string;
  globalPrefix: string;
  database: { url: string };
  allowedOrigins: string[];
}
