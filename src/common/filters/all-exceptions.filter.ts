// src/common/filters/all-exceptions.filter.ts
import {
  Catch,
  HttpException,
  HttpStatus,
  ArgumentsHost,
  Injectable,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@/common/filters/base-exception.filter';
import { LoggerService } from '@/logger/logger.service';
import { Response, Request } from 'express';

/**
 * Catch-all global exception filter for unhandled errors.
 */
@Injectable()
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Skip favicon requests (noisy in logs)
    if (this.isFaviconRequest(req)) {
      return res.status(204).send();
    }

    const { status, message } = this.resolveExceptionDetails(exception);
    this.handleResponse(host, status, message, exception);
  }

  private isFaviconRequest(req: Request): boolean {
    return req.url === '/favicon.ico';
  }

  private resolveExceptionDetails(exception: unknown): {
    status: number;
    message: string;
  } {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resData = exception.getResponse();
      message = this.extractHttpExceptionMessage(resData);
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    return { status, message };
  }

  private extractHttpExceptionMessage(responseBody: unknown): string {
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
}
