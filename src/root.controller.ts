// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class RootController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  getRoot() {
    const appName = this.config.get<string>('APP_NAME') || 'Credence API';
    const env = this.config.get<string>('NODE_ENV') || 'development';
    const version = this.config.get<string>('APP_VERSION') || '1.0.0';

    const data = {
        version,
        name: appName,
        message: `Welcome to ${appName}!`,
        environment: env,
        uptime: `${process.uptime().toFixed(0)}s`,
        docs: '/api/docs', // if you add Swagger later
        health: '/api/health',
      }
      return data;
  }
}
