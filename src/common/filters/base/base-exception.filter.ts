// src/common/filters/base/base-exception.filter.ts
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggerService } from '@/logger/services/logger.service';
import { buildResponse } from '@/common/utils';
import { LOG_CONTEXTS } from '@/common/constants';

export abstract class BaseExceptionFilter<
  T = unknown,
> implements ExceptionFilter {
  constructor(protected readonly logger: LoggerService) {}

  abstract catch(exception: T, host: ArgumentsHost): void;

  protected logException(message: string, stack?: string, context?: string) {
    // Compose message with context details if provided
    const enrichedMessage = context ? `${message} [${context}]` : message;

    this.logger.error(enrichedMessage, stack, LOG_CONTEXTS.FILTER);
  }

  protected sendResponse(
    res: Response,
    req: Request,
    status: number,
    message: string,
  ) {
    res.status(status).json(buildResponse(null, req.url, status, message));
  }

  protected handleResponse(
    host: ArgumentsHost,
    status: number,
    message: string,
    exception?: T,
  ) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const stack = exception instanceof Error ? exception.stack : undefined;
    const context = `${this.constructor.name} ${req.method} ${req.url}`;

    this.logException(message, stack, context);
    this.sendResponse(res, req, status, message);
  }
}
