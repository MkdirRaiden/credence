// src/common/common.module.ts
import { Module, Global } from '@nestjs/common';
import { ResponseInterceptor } from '@/common/interceptors';
import {
  AllExceptionsFilter,
  PrismaClientExceptionFilter,
  ValidationExceptionFilter,
} from '@/common/filters';

@Global()
@Module({
  providers: [
    // Register global interceptors and filters for DI
    ResponseInterceptor,
    PrismaClientExceptionFilter,
    ValidationExceptionFilter,
    AllExceptionsFilter,
  ]
})
export class CommonModule {}
