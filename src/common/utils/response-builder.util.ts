// src/common/utils/response-builder.util.ts
export function buildResponse<T>(
  data: T,
  path: string,
  statusCode: number,
  success = true,
  message?: string,
) {
  return {
    success,
    statusCode,
    message:
      message ?? (success ? 'Request successful' : 'Internal server error'),
    data: success ? data : (undefined as T | undefined),
    timestamp: new Date().toISOString(),
    path,
  };
}
