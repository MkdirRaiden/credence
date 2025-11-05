// src/common/filters/prisma-exception.filter.ts
import { Catch, ArgumentsHost, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseExceptionFilter } from '@/common/filters/base-exception.filter';
import { LoggerService } from '@/logger/services/logger.service';

/**
 * Handles Prisma-specific database errors and maps to HTTP responses.
 */
@Injectable()
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const { status, message } = this.mapPrismaError(exception);
    this.handleResponse(host, status, message, exception);
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
        };
      }
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Record not found',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
        };
    }
  }
}
