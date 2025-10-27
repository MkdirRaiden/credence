// src/bootstrap/bootstrap.ts
import {
  INestApplication,
  ValidationPipe,
  NestInterceptor,
  ExceptionFilter,
} from '@nestjs/common';
import {
  GLOBAL_FILTERS,
  GLOBAL_INTERCEPTORS,
} from '@/bootstrap/bootstrap.config';
import { 
  redirectToRoot,
  resolveAndRegister,
  getServerConfig 
}  from '@/bootstrap/helpers';
import { ModuleRef } from '@nestjs/core';
import helmet from 'helmet';
import compression from 'compression';
import { Express } from 'express';
import { LoggerService } from '@/logger/logger.service';

export class Bootstrap {

  // Configure global middlewares such as helmet, compression, CORS, prefix, etc.
  private static configureMiddlewares(app: INestApplication): void {
    // get required config
    const { allowedOrigins, globalPrefix } = getServerConfig(app);
    // Security middleware
    app.use(helmet());
    // Trust reverse proxy headers if behind a proxy
    const expressApp = app.getHttpAdapter()?.getInstance() as Express | undefined;
    expressApp?.set('trust proxy', 1);
    // Response compression
    app.use(compression());
    // CORS setup
    app.enableCors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : false,
      credentials: true,
    });
    // Global API prefix
    app.setGlobalPrefix(globalPrefix);
    // Redirect 
    app.use(redirectToRoot(globalPrefix));

  }

  // Configure global pipes, interceptors, and filters.
  private static configureGlobals(app: INestApplication, moduleRef: ModuleRef): void {
    // Validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    const logger = app.get(LoggerService);
    // Global interceptors
    resolveAndRegister<NestInterceptor>(moduleRef, GLOBAL_INTERCEPTORS, (i) =>
      app.useGlobalInterceptors(i), logger
    );
    // Global exception filters
    resolveAndRegister<ExceptionFilter>(moduleRef, GLOBAL_FILTERS, (f) =>
      app.useGlobalFilters(f), logger
    );
  }

  // Enable graceful shutdown hooks.
  private static configureShutdownHooks(app: INestApplication): void {
    app.enableShutdownHooks();
  }

  // Initialize all bootstrap steps
  static init(app: INestApplication): void {
    const moduleRef = app.get(ModuleRef);
    this.configureMiddlewares(app);
    this.configureGlobals(app, moduleRef);
    this.configureShutdownHooks(app);
  }
}
