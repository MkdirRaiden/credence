// src/bootstrap/bootstrap.config.ts
import { ResponseInterceptor } from '@/common/interceptors';
import {
  AllExceptionsFilter,
  PrismaClientExceptionFilter,
  ValidationExceptionFilter
} from '@/common/filters'

// Global Interceptors (ordered)
export const GLOBAL_INTERCEPTORS = [ResponseInterceptor];

// Global Filters (ordered: Prisma → Validation → All)
export const GLOBAL_FILTERS = [
  PrismaClientExceptionFilter,
  ValidationExceptionFilter,
  AllExceptionsFilter,
];
