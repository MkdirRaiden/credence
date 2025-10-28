// src/common/filters/prisma-exception.filter.ts
import { Catch, ArgumentsHost, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseExceptionFilter } from '@/common/filters/base-exception.filter';
import { gracefulShutdown } from '@/common/utils';
import { LoggerService } from '@/logger/logger.service';

@Injectable()
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const { status, message, critical } = this.mapPrismaError(exception);

    this.handleResponse(host, status, message, exception);

    if (critical) {
      gracefulShutdown(
        this.logger,
        'Critical database failure — shutting down application',
      );
    }
  }

  private mapPrismaError(exception: Prisma.PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P2002': {
        const fields = Array.isArray(exception.meta?.target)
          ? exception.meta.target.join(', ')
          : 'unknown';
        return {
          status: HttpStatus.CONFLICT,
          message: `Unique constraint failed on fields: ${fields}`,
          critical: false,
        };
      }
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          critical: false,
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: exception.message,
          critical: true,
        };
    }
  }
}
