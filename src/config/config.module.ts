// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { ConfigHelper } from './config.helper';
import { configValidationSchema } from './config.schema';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ConfigHelper.getEnvFilePaths(),
      expandVariables: true,
      validationSchema: configValidationSchema,
      validationOptions: { abortEarly: true }, // fail fast if missing env vars
    }),
  ],
})
export class ConfigModule {}
