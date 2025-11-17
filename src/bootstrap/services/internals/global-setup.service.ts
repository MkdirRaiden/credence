// src/bootstrap/services/internal/global-setup.service.ts
import {
  Injectable,
  INestApplication,
  ValidationPipe,
  NestInterceptor,
  ExceptionFilter,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { LoggerService } from '@/logger/services';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { resolveAndRegister } from '@/bootstrap/helpers';
import { GLOBAL_INTERCEPTORS, GLOBAL_FILTERS } from '@/common/modules';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces';

/**
 * Configures global pipes, interceptors, and exception filters after DI initialization.
 */
@Injectable()
export class GlobalSetupService {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  setup(app: INestApplication, moduleRef: ModuleRef): void {
    this.setupSwagger(app);
    this.setupValidationPipe(app);
    this.setupInterceptors(app, moduleRef);
    this.setupFilters(app, moduleRef);
  }

  private setupSwagger(app: INestApplication): void {
    const serverData = this.config.get('server', { infer: true });
    const appData = this.config.get('app', { infer: true });
    const enableDocs = serverData.nodeEnv !== 'production';
    if (!enableDocs) return;

    const config = new DocumentBuilder()
      .setTitle(appData.appName)
      .setDescription(appData.swaggerDescription)
      .setVersion(appData.appVersion)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(appData.apiDocsPath, app, document);
  }

  private setupValidationPipe(app: INestApplication): void {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
  }

  private setupInterceptors(app: INestApplication, moduleRef: ModuleRef): void {
    resolveAndRegister<NestInterceptor>(
      moduleRef,
      GLOBAL_INTERCEPTORS,
      (i) => app.useGlobalInterceptors(i),
      this.logger,
    );
  }

  private setupFilters(app: INestApplication, moduleRef: ModuleRef): void {
    resolveAndRegister<ExceptionFilter>(
      moduleRef,
      GLOBAL_FILTERS,
      (f) => app.useGlobalFilters(f),
      this.logger,
    );
  }
}
