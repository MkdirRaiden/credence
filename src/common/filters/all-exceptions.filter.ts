// src/common/filters/all-exceptions.filter.ts
import { Catch, ArgumentsHost, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from '@/common/filters/base/base-exception.filter';
import { LoggerService } from '@/logger/services';
import {
  resolveExceptionDetails,
  isFaviconRequest,
} from '@/common/filters/helpers/resolve-exception-details';

@Injectable()
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<{ url: string }>();
    const res = ctx.getResponse<Response>();

    if (isFaviconRequest(req.url)) {
      res.status(204).send();
      return;
    }

    const { status, message } = resolveExceptionDetails(exception);
    this.handleResponse(host, status, message, exception);
  }
}
