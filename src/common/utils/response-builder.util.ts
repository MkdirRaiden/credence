// src/common/utils/response-builder.ts
export function buildResponse(
  data: any,
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
    data: success ? data : undefined,
    timestamp: new Date().toISOString(),
    path,
  };
}
