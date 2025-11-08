// src/common/modules/common.config.ts
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { VisibilityInterceptor } from '@/common/interceptors/visibility.interceptor';
import * as filters from '@/common/filters';

// Export these!
export const GLOBAL_INTERCEPTORS = [ResponseInterceptor, VisibilityInterceptor];

/**
 * CRITICAL: Filter order matters!
 * Specific filters first → Generic filter last
 * AllExceptionsFilter MUST be last to catch unhandled exceptions
 */
export const GLOBAL_FILTERS = [
  filters.ValidationExceptionFilter,
  filters.PrismaClientExceptionFilter,
  filters.AllExceptionsFilter,
];

export const CRITICAL_PROVIDERS = [
  'AllExceptionsFilter',
  'ValidationExceptionFilter',
];
