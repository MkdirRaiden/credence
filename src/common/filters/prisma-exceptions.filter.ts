// src/common/filters/prisma-exceptions.filter.ts
import { Catch, ArgumentsHost, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseExceptionFilter } from '@/common/filters/base/base-exception.filter';
import { LoggerService } from '@/logger/services';
import * as helpers from '@/common/filters/helpers';

@Injectable()
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const { status, message } = helpers.mapPrismaError(exception);
    this.handleResponse(host, status, message, exception);
  }
}
