// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      isGlobal: true, // available everywhere
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // dynamic per env
    }),
  ],
})
export class ConfigModule {}
