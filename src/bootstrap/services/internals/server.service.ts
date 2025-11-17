// src/bootstrap/services/internal/server.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import type { AppConfig } from '@/common/interfaces';
import { ConfigService } from '@nestjs/config';

/**
 * Starts HTTP server and logs the listening URL.
 */
@Injectable()
export class ServerService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  get server() {
    const server = this.config.get('server', { infer: true });
    return server;
  }

  async start(app: INestApplication): Promise<void> {
    const { port, host, globalPrefix, nodeEnv } = this.server;
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
