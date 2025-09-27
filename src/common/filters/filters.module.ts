import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';
import { ValidationExceptionFilter } from './validation-exception.filter';

@Module({
  providers: [AllExceptionsFilter, PrismaClientExceptionFilter, ValidationExceptionFilter],
  exports: [AllExceptionsFilter, PrismaClientExceptionFilter, ValidationExceptionFilter],
})
export class FiltersModule {}
