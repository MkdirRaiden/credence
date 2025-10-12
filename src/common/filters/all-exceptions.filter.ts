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

    // Skip noisy favicon.ico errors
    if (req.url === '/favicon.ico') {
      return res.status(204).send();
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resData = exception.getResponse();
      if (typeof resData === 'string') {
        message = resData;
      } else if (
        resData &&
        typeof resData === 'object' &&
        'message' in resData
      ) {
        const msg = (resData as { message?: string }).message;
        if (msg) message = msg;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.handleResponse(host, status, message, exception);
  }
}
