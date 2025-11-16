// src/bootstrap/services/internal/server.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import type { AppConfig } from '@/common/interfaces';

/**
 * Starts HTTP server and logs the listening URL.
 */
@Injectable()
export class ServerService {
  constructor(private readonly logger: LoggerService) {}

  async start(
    app: INestApplication,
    serverConfig: AppConfig['server'],
  ): Promise<void> {
    const { port, host, globalPrefix, nodeEnv } = serverConfig;
    await app.listen(port);
    const protocol = nodeEnv === 'production' ? 'https' : 'http';
    const normPrefix = String(globalPrefix ?? '').replace(/^\/+|\/+$/g, '');
    const baseUrl = normPrefix
      ? `${protocol}://${host}:${port}/${normPrefix}`
      : `${protocol}://${host}:${port}`;
    this.logger.log(
      `🚀 Server running on ${baseUrl} [${nodeEnv}]`,
      'Bootstrap',
    );
  }
}
