// src/bootstrap/services/middleware-setup.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { EXCLUDE_PREFIX_ARRAY } from '@/common/constants';

/**
 * Configures global middleware for security, compression, and CORS.
 */
@Injectable()
export class MiddlewareSetupService {
  // Order: Helmet → Compression → CORS → Global Prefix
  setup(
    app: INestApplication,
    allowedOrigins: string[],
    globalPrefix: string,
  ): void {
    this.setupSecurity(app);
    this.setupCompression(app);
    this.setupCors(app, allowedOrigins);
    this.setupGlobalPrefix(app, globalPrefix);
  }

  private setupSecurity(app: INestApplication): void {
    app.use(helmet());
  }

  private setupCompression(app: INestApplication): void {
    app.use(compression());
  }

  private setupCors(app: INestApplication, allowedOrigins: string[]): void {
    app.enableCors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : false,
      credentials: true,
    });
  }

  private setupGlobalPrefix(app: INestApplication, globalPrefix: string): void {
    app.setGlobalPrefix(globalPrefix, { exclude: EXCLUDE_PREFIX_ARRAY });
  }
}