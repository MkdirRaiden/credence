// src/common/exceptions/base/base-domain.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export interface DomainErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Base exception for domain errors across features.
 * Filters and clients can rely on `code` to classify errors.
 */
export class DomainException extends HttpException {
  readonly code: string;

  constructor(payload: DomainErrorPayload, status: HttpStatus) {
    super(
      {
        code: payload.code,
        message: payload.message,
        details: payload.details,
      },
      status,
    );
    this.code = payload.code;
  }
}
