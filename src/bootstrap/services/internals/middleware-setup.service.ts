// src/bootstrap/services/internal/middleware-setup.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import { RequestIdMiddleware } from '@/common/middlewares';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces';

/**
 * Configures global middleware for security, compression, CORS, and request tracing.
 * Order matters: RequestId → Security → Compression → CORS → GlobalPrefix
 */
@Injectable()
export class MiddlewareSetupService {
  constructor(private readonly config: ConfigService<AppConfig, true>) {}

  get server() {
    const server = this.config.get('server', { infer: true });
    return server;
  }

  setup(app: INestApplication): void {
    this.setupRequestId(app);
    this.setupBodyParsing(app);
    this.setupSecurity(app);
    this.setupCompression(app);
    this.setupCors(app);
    this.setupGlobalPrefix(app);
  }

  private setupRequestId(app: INestApplication): void {
    const middleware = new RequestIdMiddleware();
    app.use(middleware.use.bind(middleware));
  }

  private setupBodyParsing(app: INestApplication): void {
    const maxRequestSize = this.server.maxRequestSize;
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

  private setupCors(app: INestApplication): void {
    const allowedOrigins = this.server.allowedOrigins;
    app.enableCors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : false,
      credentials: true,
    });
  }

  private setupGlobalPrefix(app: INestApplication): void {
    app.setGlobalPrefix(this.server.globalPrefix, {
      exclude: this.server.excludePrefixArray,
    });
  }
}
