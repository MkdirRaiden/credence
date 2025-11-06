// src/common/filters/helpers/map-prisma-error.ts
import { Prisma } from '@prisma/client';
import { HttpStatus } from '@nestjs/common';

/**
 * Pure function — map Prisma error codes to HTTP status and message.
 */
export function mapPrismaError(
  exception: Prisma.PrismaClientKnownRequestError,
) {
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
