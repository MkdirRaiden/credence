// src/bootstrap/helpers/config-accessor.ts
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@/common/interfaces/app-config.interface';

/**
 * Provides a minimal subset of configuration
 * required during bootstrap and server info logging.
 * Assumes all values are already validated at startup.
 */
export function getServerConfig(app: INestApplication): Pick<
  Required<AppConfig>,
  'port' | 'host' | 'globalPrefix' | 'allowedOrigins'
> {
  const configService = app.get<ConfigService<AppConfig>>(ConfigService);

  return {
    port: configService.getOrThrow('port'),
    host: configService.getOrThrow('host'),
    globalPrefix: configService.getOrThrow('globalPrefix'),
    allowedOrigins: configService.getOrThrow('allowedOrigins'),
  };
}
