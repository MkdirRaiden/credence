// src/common/common.config.ts
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { VisibilityInterceptor } from '@/common/interceptors/visibility.interceptor';
import { PrismaClientExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { ValidationExceptionFilter } from '@/common/filters/validation-exception.filter';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';

export const GLOBAL_INTERCEPTORS = [ResponseInterceptor, VisibilityInterceptor];

export const GLOBAL_FILTERS = [
  PrismaClientExceptionFilter,
  ValidationExceptionFilter,
  AllExceptionsFilter,
];
