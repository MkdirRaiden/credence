// src/root.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces/app-config.interface';

@Controller()
export class RootController {
  constructor(private readonly config: ConfigService<AppConfig>) {}

  @Get()
  getRoot() {
    // type-safe access, throws if missing
    const appName = this.config.getOrThrow('appName');
    const appVersion = this.config.getOrThrow('appVersion');
    const nodeEnv = this.config.getOrThrow('nodeEnv');

    return {
      version: appVersion,
      name: appName,
      message: `Welcome to ${appName}!`,
      environment: nodeEnv,
      uptime: `${process.uptime().toFixed(0)}s`,
      docs: '/api/docs',
      health: '/api/health',
    };
  }
}
