// src/common/filters/helpers/resolve-exception-details.ts
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Pure function — extract HTTP status and message from any exception.
 */
export function resolveExceptionDetails(exception: unknown): {
  status: number;
  message: string;
} {
  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';

  if (exception instanceof HttpException) {
    status = exception.getStatus();
    const resData = exception.getResponse();
    message = extractHttpExceptionMessage(resData);
  } else if (exception instanceof Error) {
    message = exception.message;
  }

  return { status, message };
}

export function extractHttpExceptionMessage(responseBody: unknown): string {
  if (typeof responseBody === 'string') {
    return responseBody;
  }

  if (
    responseBody &&
    typeof responseBody === 'object' &&
    'message' in responseBody
  ) {
    const msg = (responseBody as { message?: string }).message;
    if (msg) return msg;
  }

  return 'Internal server error';
}

export function isFaviconRequest(url: string): boolean {
  return url === '/favicon.ico';
}
