// src/bootstrap/bootstrap.ts
import {
  INestApplication,
  ValidationPipe,
  NestInterceptor,
  ExceptionFilter,
} from '@nestjs/common';
import helmet from 'helmet';
import { ModuleRef } from '@nestjs/core';
import { GLOBAL_FILTERS, GLOBAL_INTERCEPTORS } from '@/bootstrap/bootstrap.config';
import { ConfigService } from '@nestjs/config';
import { BootstrapHelpers } from '@/bootstrap/bootstrap.helpers';
import { GLOBAL_PREFIX } from '@/common/constants';

export class Bootstrap {

  // Configure middlewares
  private static configureMiddlewares(app: INestApplication) {
    // Access ConfigService
    const configService = app.get(ConfigService);
    // Security middleware
    app.use(helmet());
    // CORS
    const allowedOrigins = configService.get<string[]>('allowedOrigins');
    app.enableCors({
      origin: allowedOrigins,
      credentials: true,
    });
    // Global prefix
    const prefix = configService.get<string>('globalPrefix', GLOBAL_PREFIX);
    app.setGlobalPrefix(prefix);
    // Redirect middleware (centralized)
    app.use(BootstrapHelpers.redirectToRoot(prefix));
  }

  // Register global pipes, filters, and interceptors
  private static configureGlobals(app: INestApplication, moduleRef: ModuleRef) {
    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    // Global interceptors registeration
    BootstrapHelpers.resolveAndRegister<NestInterceptor>(
      moduleRef,
      GLOBAL_INTERCEPTORS,
      (i) => app.useGlobalInterceptors(i),
    );
    // Global filters registration
    BootstrapHelpers.resolveAndRegister<ExceptionFilter>(
      moduleRef,
      GLOBAL_FILTERS,
      (f) => app.useGlobalFilters(f),
    );
  }
  // Enable graceful shutdown hooks
  private static configureShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
  }

  // Centralized bootstrap method
  public static init(app: INestApplication) {
    const moduleRef = app.get(ModuleRef);
    this.configureMiddlewares(app);
    this.configureGlobals(app, moduleRef);
    this.configureShutdownHooks(app);
  }
}
