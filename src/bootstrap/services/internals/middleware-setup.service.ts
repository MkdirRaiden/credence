// src/bootstrap/services/internal/middleware-setup.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import { RequestIdMiddleware } from '@/common/middlewares';
import type { AppConfig } from '@/common/interfaces';

/**
 * Configures global middleware for security, compression, CORS, and request tracing.
 * Order matters: RequestId → Security → Compression → CORS → GlobalPrefix
 */
@Injectable()
export class MiddlewareSetupService {
  setup(app: INestApplication, serverConfig: AppConfig['server']): void {
    this.setupRequestId(app);
    this.setupBodyParsing(app, serverConfig.maxRequestSize);
    this.setupSecurity(app);
    this.setupCompression(app);
    this.setupCors(app, serverConfig.allowedOrigins);
    this.setupGlobalPrefix(
      app,
      serverConfig.globalPrefix,
      serverConfig.excludePrefixArray,
    );
  }

  private setupRequestId(app: INestApplication): void {
    const middleware = new RequestIdMiddleware();
    app.use(middleware.use.bind(middleware));
  }

  private setupBodyParsing(
    app: INestApplication,
    maxRequestSize: string,
  ): void {
    app.use(express.json({ limit: maxRequestSize }));
    app.use(express.urlencoded({ extended: true, limit: maxRequestSize }));
  }

  private setupSecurity(app: INestApplication): void {
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      }),
    );
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

  private setupGlobalPrefix(
    app: INestApplication,
    globalPrefix: string,
    excludePrefixArray: string[],
  ): void {
    app.setGlobalPrefix(globalPrefix, { exclude: excludePrefixArray });
  }
}
