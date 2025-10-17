// src/bootstrap/bootstrap.config.ts
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { PrismaClientExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from '@/common/filters/validation-exception.filter';

// Global Interceptors (ordered)
export const GLOBAL_INTERCEPTORS = [ResponseInterceptor];

// Global Filters (ordered: Prisma → Validation → All)
export const GLOBAL_FILTERS = [
  PrismaClientExceptionFilter,
  ValidationExceptionFilter,
  AllExceptionsFilter,
];
