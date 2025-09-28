import { Module } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { PrismaClientExceptionFilter } from './prisma-exception.filter';
import { ValidationExceptionFilter } from './validation-exception.filter';
import { ConfigValidationExceptionFilter } from 
'./config-validation-exception.filter';

@Module({
  providers: [
    AllExceptionsFilter,
    PrismaClientExceptionFilter,
    ValidationExceptionFilter,
    ConfigValidationExceptionFilter,
  ],
  exports: [
    AllExceptionsFilter,
    PrismaClientExceptionFilter,
    ValidationExceptionFilter,
    ConfigValidationExceptionFilter,
  ],
})
export class FiltersModule {}
