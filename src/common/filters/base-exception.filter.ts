// src/common/filters/base-exception.filter.ts
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '@/logger/logger.service';
import { buildResponse } from '@/common/utils/response-builder.util';

export abstract class BaseExceptionFilter<T = unknown>
  implements ExceptionFilter
{
  constructor(protected readonly logger: LoggerService) {}

  abstract catch(exception: T, host: ArgumentsHost): void;

  protected handleResponse(
    host: ArgumentsHost,
    status: number,
    message: string,
    exception?: T,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Safely extract stack if available
    const stack =
      exception && exception instanceof Error ? exception.stack : undefined;

    this.logger.error(message, stack, this.constructor.name);

    response
      .status(status)
      .json(buildResponse(null, request.url, status, false, message));
  }
}
