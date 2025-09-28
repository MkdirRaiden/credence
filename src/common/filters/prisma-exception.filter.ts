// src/common/filters/prisma-exception.filter.ts
import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseExceptionFilter } from './base-exception.filter';
import { gracefulShutdown } from '../utils/shutdown.util';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';
    let criticalFailure = false;

    switch (exception.code) {
      case 'P2002': // Unique constraint
        status = HttpStatus.CONFLICT;
        const fields = exception.meta?.target as string[] | undefined;
        message = `Unique constraint failed on fields: ${fields?.join(', ') ?? 'unknown'}`;
        break;
      case 'P2025': // Record not found
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      default:
        message = exception.message;
        criticalFailure = true; // unknown DB error → treat as critical
    }

    // Centralized logging + JSON response
    this.handleResponse(host, status, message, exception);

    // Shutdown only for critical DB failures
    if (criticalFailure) {
       gracefulShutdown(this.logger, 'Critical database failure — shutting down application...');
    }
  }
}
