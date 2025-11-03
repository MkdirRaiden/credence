// src/bootstrap/services/shutdown.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import { LoggerService } from '@/logger/logger.service';

/**
 * Registers graceful shutdown handlers for SIGTERM and SIGINT signals.
 */
@Injectable()
export class ShutdownService {
  constructor(private readonly logger: LoggerService) {}

  registerHandlers(app: INestApplication): void {
    ['SIGTERM', 'SIGINT'].forEach((signal) => {
      process.on(signal, async () => {
        this.logger.log(
          `${signal} received, shutting down gracefully...`,
          'Bootstrap.Shutdown',
        );
        await app.close();
        process.exit(0);
      });
    });
  }
}
