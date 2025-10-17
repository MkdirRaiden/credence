// src/common/filters/base-exception.filter.ts
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '@/logger/logger.service';
import { buildResponse } from '@/common/utils/response.builder';

export abstract class BaseExceptionFilter<T = unknown> implements ExceptionFilter {
  constructor(protected readonly logger: LoggerService) {}

  abstract catch(exception: T, host: ArgumentsHost): void;

  // Centralized response handling to ensure consistent logging and response format
  protected handleResponse(
    host: ArgumentsHost,
    status: number,
    message: string,
    exception?: T,
  ) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // Safely extract stack if provided
    const stack = exception instanceof Error ? exception.stack : undefined;
    // Optional, minimal request context to improve log forensics
    // Keep it in the log context string to avoid altering the envelope schema.
    const context = `${this.constructor.name} ${req.method} ${req.url}`;
    // Single structured log line; stack is routed to trace by your logger helpers
    this.logger.error(message, stack, context);
    // Emit standard error envelope; data is omitted on failure per builder
    res
      .status(status)
      .json(buildResponse(null, req.url, status, false, message));
  }
}
