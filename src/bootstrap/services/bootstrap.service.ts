// src/bootstrap/services/bootstrap.service.ts
import { Injectable, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { AppConfig } from '@/common/interfaces';
import * as services from '@/bootstrap/services';

@Injectable()
export class BootstrapService {
  constructor(
    private readonly config: ConfigService<AppConfig, true>,
    private readonly middlewareSetup: services.MiddlewareSetupService,
    private readonly globalSetup: services.GlobalSetupService,
    private readonly readiness: services.ReadinessService,
    private readonly server: services.ServerService,
    private readonly shutdown: services.ShutdownService,
  ) {}

  init(app: INestApplication): void {
    const moduleRef = app.get(ModuleRef);
    const serverConfig = this.getServerConfig();
    this.middlewareSetup.setup(app, serverConfig);
    this.globalSetup.setup(app, moduleRef);
    app.enableShutdownHooks();
    this.shutdown.registerHandlers(app);
  }

  async start(app: INestApplication): Promise<void> {
    const serverConfig = this.getServerConfig();
    await this.readiness.run();
    await this.server.start(app, serverConfig);
  }

  private getServerConfig(): AppConfig['server'] {
    return this.config.get('server', { infer: true });
  }
}
