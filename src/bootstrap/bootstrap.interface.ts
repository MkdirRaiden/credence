// src/bootstrap/bootstrap.interface.ts
export interface ServerConfig {
  nodeEnv: string;
  port: number;
  host: string;
  globalPrefix: string;
  allowedOrigins: string[];
}
