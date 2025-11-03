// src/bootstrap/bootstrap.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { AppConfig } from '@/common/interfaces/app-config.interface';
import { ServerConfig } from '@/bootstrap/bootstrap.interface';
import { extractConfig } from '@/common/utils';
import {
  MiddlewareSetupService,
  GlobalSetupService,
  ServerService,
  ReadinessService,
} from '@/bootstrap/services';

/**
 * Orchestrates NestJS application initialization, setup, and startup phases.
 */
@Injectable()
export class BootstrapService {
  constructor(
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly middlewareSetup: MiddlewareSetupService,
    private readonly globalSetup: GlobalSetupService,
    private readonly readiness: ReadinessService,
    private readonly server: ServerService,
  ) {}

  // Order: Middleware → Pipes/Interceptors/Filters → Shutdown hooks
  init(app: INestApplication): void {
    const moduleRef = app.get(ModuleRef);
    const serverConfig = this.getServerConfig();
    this.middlewareSetup.setup(
      app,
      serverConfig.allowedOrigins,
      serverConfig.globalPrefix,
    );
    this.globalSetup.setup(app, moduleRef);
    app.enableShutdownHooks();
  }

  // Order: Readiness checks → Start HTTP server
  async start(app: INestApplication): Promise<void> {
    const serverConfig = this.getServerConfig();
    await this.readiness.run(app);
    await this.server.start(app, serverConfig);
  }

  private getServerConfig(): ServerConfig {
    return extractConfig(this.configService, [
      'nodeEnv',
      'port',
      'host',
      'globalPrefix',
      'allowedOrigins',
    ] as const);
  }
}
