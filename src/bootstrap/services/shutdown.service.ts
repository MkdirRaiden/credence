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
      process.on(signal, () => {
        this.logger.log(
          `${signal} received, shutting down gracefully...`,
          'Bootstrap.Shutdown',
        );
        app
          .close()
          .then(() => process.exit(0))
          .catch(() => process.exit(1));
      });
    });
  }
}
