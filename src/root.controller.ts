// src/root.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '@/common/interfaces/app-config.interface';

@Controller()
export class RootController {
  constructor(private readonly configService: ConfigService<AppConfig, true>) {}

  @Get()
  getInfo(): { name: string; version: string; environment: string } {
    const name: string = this.configService.get('appName', { infer: true });
    const version: string = this.configService.get('appVersion', {
      infer: true,
    });
    const environment: string = this.configService.get('nodeEnv', {
      infer: true,
    });

    return {
      name,
      version,
      environment,
    };
  }
}
