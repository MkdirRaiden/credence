// src/bootstrap/bootstrap.config.ts
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { PrismaClientExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from '@/common/filters/validation-exception.filter';

// Global Interceptors
export const GLOBAL_INTERCEPTORS = [ResponseInterceptor];

// Global Filters (order matters)
// The filters are registered in this order of priority:
// 1. ConfigValidationExceptionFilter → handle critical startup config issues first (can trigger shutdown)
// 2. PrismaClientExceptionFilter → handle database-related errors next
// 3. ValidationExceptionFilter → handle request DTO validation errors
// 4. AllExceptionsFilter → catch any remaining unhandled exceptions
export const GLOBAL_FILTERS = [
  PrismaClientExceptionFilter,
  ValidationExceptionFilter,
  AllExceptionsFilter,
];
