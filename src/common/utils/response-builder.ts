// src/common/utils/response-builder.ts
import { StandardResponse } from '@/common/interfaces';

/**
 * Builds standardized API response envelope with success/error handling.
 */
export function buildResponse<T>(
  data: T,
  path: string,
  statusCode: number,
  message?: string,
): StandardResponse<T> {
  const success = statusCode < 400;

  return {
    success,
    statusCode,
    message:
      message ?? (success ? 'Request successful' : 'Internal server error'),
    data: success ? data : undefined,
    timestamp: new Date().toISOString(),
    path,
  };
}
