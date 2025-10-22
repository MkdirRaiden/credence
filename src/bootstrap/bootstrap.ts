// src/bootstrap/bootstrap.ts
import {
  INestApplication,
  ValidationPipe,
  NestInterceptor,
  ExceptionFilter,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  GLOBAL_FILTERS,
  GLOBAL_INTERCEPTORS,
} from '@/bootstrap/bootstrap.config';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import compression from 'compression';
import { redirectToRoot, resolveAndRegister } from '@/bootstrap/helpers';
import { GLOBAL_PREFIX } from '@/common/constants';
import { Express } from 'express';

export class Bootstrap {
  // Application middlewares
  private static configureMiddlewares(app: INestApplication) {
    // Access ConfigService
    const configService = app.get(ConfigService);
    // Security middleware
    app.use(helmet());
    // This configuration is safe and supported by Express under the hood.
    // Properly typed Express app without generics
    const expressApp = app.getHttpAdapter()?.getInstance() as
      | Express
      | undefined;
    expressApp?.set('trust proxy', 1);
    // Response compression
    app.use(compression());
    // CORS setup - allow list from config or disable if none specified
    const allowedOrigins = configService.get<string[]>('allowedOrigins') ?? [];
    app.enableCors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : false,
      credentials: true,
    });
    // Global API prefix from config (default 'api')
    const prefix = configService.get<string>('globalPrefix', GLOBAL_PREFIX);
    app.setGlobalPrefix(prefix);
    // Redirect root requests to the API prefix
    app.use(redirectToRoot(prefix));
  }

  private static configureGlobals(app: INestApplication, moduleRef: ModuleRef) {
    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    // Global interceptors
    resolveAndRegister<NestInterceptor>(moduleRef, GLOBAL_INTERCEPTORS, (i) =>
      app.useGlobalInterceptors(i),
    );
    // Global exception filters
    resolveAndRegister<ExceptionFilter>(moduleRef, GLOBAL_FILTERS, (f) =>
      app.useGlobalFilters(f),
    );
  }

  // Graceful shutdown hooks
  private static configureShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
  }

  // Application initialization
  static init(app: INestApplication) {
    const moduleRef = app.get(ModuleRef);
    this.configureMiddlewares(app);
    this.configureGlobals(app, moduleRef);
    this.configureShutdownHooks(app);
  }
}
