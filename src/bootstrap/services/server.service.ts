// src/bootstrap/services/server.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import { LoggerService } from '@/logger/services/logger.service';
import { startServerAndLog } from '@/bootstrap/helpers';
import { ServerConfig } from '@/bootstrap/bootstrap.interface';

/**
 * Starts HTTP server and logs the listening URL.
 */
@Injectable()
export class ServerService {
  constructor(private readonly logger: LoggerService) {}

  async start(app: INestApplication, config: ServerConfig): Promise<void> {
    await startServerAndLog(config, app, this.logger);
  }
}
