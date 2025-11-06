// src/bootstrap/services/middleware-setup.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { EXCLUDE_PREFIX_ARRAY } from '@/config/factory';
import { RequestIdMiddleware } from '@/common/middlewares';

/**
 * Configures global middleware for security, compression, CORS, and request tracing.
 * Order matters: RequestId → Security → Compression → CORS → GlobalPrefix
 */
@Injectable()
export class MiddlewareSetupService {
  setup(
    app: INestApplication,
    allowedOrigins: string[],
    globalPrefix: string,
  ): void {
    this.setupRequestId(app);
    this.setupSecurity(app);
    this.setupCompression(app);
    this.setupCors(app, allowedOrigins);
    this.setupGlobalPrefix(app, globalPrefix);
  }

  private setupRequestId(app: INestApplication): void {
    const middleware = new RequestIdMiddleware();
    app.use(middleware.use.bind(middleware));
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
