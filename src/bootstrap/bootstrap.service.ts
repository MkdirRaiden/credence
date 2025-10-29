// src/bootstrap/bootstrap.service.ts
import {
  INestApplication,
  ValidationPipe,
  NestInterceptor,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import { GLOBAL_FILTERS, GLOBAL_INTERCEPTORS } from '@/common/common.config';
import {
  resolveAndRegister,
  startServerAndLog,
  runReadinessChecks,
} from '@/bootstrap/helpers';
import { extractConfig } from '@/common/utils';
import { ModuleRef } from '@nestjs/core';
import helmet from 'helmet';
import compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@/logger/logger.service';
import { AppConfig } from '@/common/interfaces/app-config.interface';
import { ServerConfig } from '@/bootstrap/bootstrap.interface';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  // Configure middlewares for security, CORS, compression, and global prefix
  private configureMiddlewares(app: INestApplication): void {
    const { allowedOrigins, globalPrefix } = this.getServerConfig();
    // Security middlewares
    app.use(helmet());
    // Compression middleware for optimal response sizes
    app.use(compression());
    // CORS configuration
    app.enableCors({
      origin: allowedOrigins.length > 0 ? allowedOrigins : false,
      credentials: true,
    });
    // Global prefix for all routes except root and health
    app.setGlobalPrefix(globalPrefix, { exclude: ['/', 'health/(.*)'] });
  }

  // Configure global pipes, interceptors, and filters
  private configureGlobals(app: INestApplication, moduleRef: ModuleRef): void {
    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    // Global interceptors registration
    resolveAndRegister<NestInterceptor>(
      moduleRef,
      GLOBAL_INTERCEPTORS,
      (i) => app.useGlobalInterceptors(i),
      this.logger,
    );
    // Global filters registration
    resolveAndRegister<ExceptionFilter>(
      moduleRef,
      GLOBAL_FILTERS,
      (f) => app.useGlobalFilters(f),
      this.logger,
    );
  }

  // Type-safe server config extraction using helper
  private getServerConfig(): ServerConfig {
    return extractConfig(this.configService, [
      'nodeEnv',
      'port',
      'host',
      'globalPrefix',
      'allowedOrigins',
    ] as const);
  }

  // Start the server and log the URL
  async startServer(app: INestApplication): Promise<void> {
    const serverConfig = this.getServerConfig();
    await startServerAndLog(serverConfig, app, this.logger);
  }

  // Run readiness checks before accepting traffic
  async runAppReadinessChecks(app: INestApplication): Promise<void> {
    await runReadinessChecks(app);
  }

  // Initialize the application with all configurations
  init(app: INestApplication): void {
    const moduleRef = app.get(ModuleRef);
    this.configureMiddlewares(app);
    this.configureGlobals(app, moduleRef);
    app.enableShutdownHooks();
  }
}
