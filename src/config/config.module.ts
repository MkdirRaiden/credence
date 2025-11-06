// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { configuration } from '@/config/factory';
import { getEnvFilePaths } from '@/config/helpers';
import { configValidationSchema } from '@/config/schemas';

/**
 * Global configuration module with runtime validation.
 * Pre-validation in main.ts catches critical vars; this validates full schema.
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: getEnvFilePaths(),
      load: [configuration],
      expandVariables: true,
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
