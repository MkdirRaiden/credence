// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from '@/config/configuration';
import { getEnvFilePaths } from '@/config/helpers';
import { configValidationSchema } from '@/config/config.schema';

/**
 * Global configuration module with runtime validation.
 * Pre-validation in main.ts catches critical vars; this validates the full schema.
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: getEnvFilePaths(),
      load: [configuration],
      expandVariables: true, // allow passing params via env vars
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}