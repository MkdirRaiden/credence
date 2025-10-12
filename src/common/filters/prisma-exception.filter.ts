// src/common/filters/prisma-exception.filter.ts
import { Catch, ArgumentsHost, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseExceptionFilter } from '@/common/filters/base-exception.filter';
import { gracefulShutdown } from '@/common/utils/shutdown.util';
import { LoggerService } from '@/logger/logger.service';

@Injectable()
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  constructor(protected readonly logger: LoggerService) {
    super(logger);
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    let criticalFailure = false;

    switch (exception.code) {
      case 'P2002': {
        // Unique constraint
        status = HttpStatus.CONFLICT;
        const fields = Array.isArray(exception.meta?.target)
          ? exception.meta.target
          : undefined;
        message = `Unique constraint failed on fields: ${fields?.join(', ') ?? 'unknown'}`;
        break;
      }
      case 'P2025': {
        // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      }
      default: {
        message = exception.message;
        criticalFailure = true; // unknown DB error → treat as critical
      }
    }

    // Centralized logging + JSON response
    this.handleResponse(host, status, message, exception);

    // Shutdown only for critical DB failures
    if (criticalFailure) {
      gracefulShutdown(
        this.logger,
        'Critical database failure — shutting down application...',
      );
    }
  }
}
