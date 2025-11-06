// src/bootstrap/helpers/start-server.ts
import { LoggerService } from '@/logger/services';
import { INestApplication } from '@nestjs/common';
import type { AppConfig } from '@/common/interfaces';

/**
 * Starts HTTP server and logs the base URL with environment info.
 */
export async function startServerAndLog(
  serverConfig: AppConfig['server'],
  app: INestApplication,
  logger: LoggerService,
): Promise<void> {
  const { port, host, globalPrefix, nodeEnv } = serverConfig;
  await app.listen(port);
  const protocol = nodeEnv === 'production' ? 'https' : 'http';
  const normPrefix = String(globalPrefix ?? '').replace(/^\/+|\/+$/g, '');
  const baseUrl = normPrefix
    ? `${protocol}://${host}:${port}/${normPrefix}`
    : `${protocol}://${host}:${port}`;
  logger.log(`🚀 Server running on ${baseUrl} [${nodeEnv}]`, 'Bootstrap');
}
