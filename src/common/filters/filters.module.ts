import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';

@Module({
  providers: [AllExceptionsFilter, PrismaClientExceptionFilter],
  exports: [AllExceptionsFilter, PrismaClientExceptionFilter],
})
export class FiltersModule {}
