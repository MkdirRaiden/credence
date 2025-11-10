// src/bootstrap/services/internal/server.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import { LoggerService } from '@/logger/services';
import { startServerAndLog } from '@/bootstrap/helpers';
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
    await startServerAndLog(serverConfig, app, this.logger);
  }
}
