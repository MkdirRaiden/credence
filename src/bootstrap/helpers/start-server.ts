// src/bootstrap/helpers/startup-log.ts
import { LoggerService } from '@/logger/logger.service';
import { INestApplication } from '@nestjs/common';
import { getServerConfig } from './server-config';

// Build a normalized base URL and log it via the DI logger
export async function startServer( app: INestApplication, logger: LoggerService) {
  const { port, globalPrefix, nodeEnv, host} = getServerConfig(app);
  await app.listen(port);

  const normPrefix = String(globalPrefix ?? '').replace(/^\/+|\/+$/g, '');
  const baseUrl = normPrefix
    ? `http://${host}:${port}/${normPrefix}`
    : `http://${host}:${port}`;
  logger.log(`🚀 Server running on ${baseUrl} [${nodeEnv}]`, 'Bootstrap');
}