// src/bootstrap/helpers/startup-log.ts
import { INestApplication } from '@nestjs/common';
import { LoggerService } from '@/logger/logger.service';

// Build a normalized base URL and log it via the DI logger
export function logStartup(
  app: INestApplication,
  host: string,
  port: number,
  prefix?: string,
) {
  const normPrefix = String(prefix ?? '').replace(/^\/+|\/+$/g, '');
  const baseUrl = normPrefix
    ? `http://${host}:${port}/${normPrefix}`
    : `http://${host}:${port}`;
  const logger = app.get(LoggerService);
  logger.log(`Server running on ${baseUrl}`, 'Bootstrap');
}
