// src/common/filters/all-exceptions.filter.ts
import { Catch, HttpException, HttpStatus, ArgumentsHost, Injectable } 
from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();

    // Skip noisy favicon.ico errors
    if (req?.url === '/favicon.ico') {
      return ctx.getResponse().status(204).send();
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || message;
    }

    this.handleResponse(host, status, message, exception);
  }

}
