// src/bootstrap/helpers/startup-log.ts
import { LoggerService } from '@/logger/logger.service';
import { INestApplication } from '@nestjs/common';
import { ServerConfig } from '@/bootstrap/bootstrap.interface';

export async function startServerAndLog(
  config: ServerConfig,
  app: INestApplication,
  logger: LoggerService,
): Promise<void> {
  const { port, host, globalPrefix, nodeEnv } = config;

  await app.listen(port);

  const normPrefix = String(globalPrefix ?? '').replace(/^\/+|\/+$/g, '');
  const baseUrl = normPrefix
    ? `http://${host}:${port}/${normPrefix}`
    : `http://${host}:${port}`;

  logger.log(`🚀 Server running on ${baseUrl} [${nodeEnv}]`, 'Bootstrap');
}
