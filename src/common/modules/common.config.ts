// src/common/modules/common.config.ts
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { VisibilityInterceptor } from '@/common/interceptors/visibility.interceptor';
import { PrismaClientExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from '@/common/filters/validation-exception.filter';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';

// Global interceptors registered in main.ts
export const GLOBAL_INTERCEPTORS = [ResponseInterceptor, VisibilityInterceptor];

// Global exception filters registered in main.ts (order matters: specific → general)
export const GLOBAL_FILTERS = [
  PrismaClientExceptionFilter,
  ValidationExceptionFilter,
  AllExceptionsFilter,
];

// Critical providers that must be present during bootstrap
export const CRITICAL_PROVIDERS = [
  'AllExceptionsFilter',
  'ValidationExceptionFilter',
];
