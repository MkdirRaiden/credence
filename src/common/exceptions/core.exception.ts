// src/common/exceptions/core.exception.ts
import { HttpStatus } from '@nestjs/common';
import { AppException } from '@/common/exceptions/base.exception';

export class DatabaseConnectionException extends AppException {
  constructor(
    attempt: number,
    maxRetries: number,
    lastError?: Error,
  ) {
    super(
      `Database connection failed after ${attempt}/${maxRetries} attempts`,
      HttpStatus.SERVICE_UNAVAILABLE,
      {
        attempt,
        maxRetries,
        lastErrorMessage: lastError?.message,
      },
    );
  }
}