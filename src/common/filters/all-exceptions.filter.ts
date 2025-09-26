// src/common/filters/all-exceptions.filter.ts
import { Catch, HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
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
