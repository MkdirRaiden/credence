// src/common/filters/base-exception.filter.ts
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '../../logger/logger.service';
import { buildResponse } from '../utils/response-builder.util';

export abstract class BaseExceptionFilter<T = unknown> implements ExceptionFilter {
  constructor(protected readonly logger: LoggerService) {}

  abstract catch(exception: T, host: ArgumentsHost): any;

  protected handleResponse(
    host: ArgumentsHost,
    status: number,
    message: string,
    exception?: any,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Log with stack trace if available
    this.logger.error(
      message,
      exception?.stack ?? JSON.stringify(exception),
      this.constructor.name,
    );
    // Send standardized JSON
    response
      .status(status)
      .json(buildResponse(null, request.url, status, false, message));
  }
}
