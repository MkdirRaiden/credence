// __tests__/unit/common/filters/helpers/map-prisma-error.spec.ts
import { mapPrismaError } from '@/common/filters/helpers';
import { Prisma } from '@prisma/client';
import { HttpStatus } from '@nestjs/common';

describe('mapPrismaError Helper', () => {
  it('maps P2002 (unique constraint) to CONFLICT', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '5.0.0',
        meta: { target: ['email', 'username'] },
      },
    );

    const result = mapPrismaError(exception);

    expect(result.status).toBe(HttpStatus.CONFLICT);
    expect(result.message).toContain('email, username');
  });

  it('maps P2025 (record not found) to NOT_FOUND', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Record not found',
      { code: 'P2025', clientVersion: '5.0.0' },
    );

    const result = mapPrismaError(exception);

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.message).toBe('Record not found');
  });

  it('handles P2002 with single field', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      { code: 'P2002', clientVersion: '5.0.0', meta: { target: ['id'] } },
    );

    const result = mapPrismaError(exception);

    expect(result.message).toContain('id');
  });

  it('defaults to 500 for unknown Prisma codes', () => {
    const exception = new Prisma.PrismaClientKnownRequestError('Some error', {
      code: 'P9999',
      clientVersion: '5.0.0',
    });

    const result = mapPrismaError(exception);

    expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(result.message).toBe('Database error');
  });
});
