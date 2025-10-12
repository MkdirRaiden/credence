// src/common/filters/filters.module.ts
import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { PrismaClientExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from '@/common/filters/validation-exception.filter';

@Module({
  providers: [
    AllExceptionsFilter,
    PrismaClientExceptionFilter,
    ValidationExceptionFilter,
  ],
  exports: [
    AllExceptionsFilter,
    PrismaClientExceptionFilter,
    ValidationExceptionFilter,
  ],
})
export class FiltersModule {}
