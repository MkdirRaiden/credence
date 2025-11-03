// src/common/exceptions/base.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Base exception with context metadata.
 */
export abstract class AppException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly context?: Record<string, any>,
  ) {
    super(message, statusCode);
  }
}
