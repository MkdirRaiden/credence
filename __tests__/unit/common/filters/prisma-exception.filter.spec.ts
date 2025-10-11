import { PrismaClientExceptionFilter } from '@/common/filters/prisma-exception.filter';
import { LoggerService } from '@/logger/logger.service';
import { Prisma } from '@prisma/client';
import { ArgumentsHost, HttpStatus } from '@nestjs/common';

describe('PrismaClientExceptionFilter', () => {
  let filter: PrismaClientExceptionFilter;
  let logger: LoggerService;
  let mockRes: any;
  let mockReq: any;
  let mockHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    logger = {
      error: jest.fn(),
      debug: jest.fn(),
      log: jest.fn(),
    } as unknown as LoggerService;

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockReq = { url: '/test' };

    mockHost = {
      switchToHttp: () => ({
        getRequest: () => mockReq,
        getResponse: () => mockRes,
        getNext: () => undefined as any, // satisfy TS
      }),
    };

    filter = new PrismaClientExceptionFilter(logger);
  });

  it('should handle unique constraint error P2002', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      { code: 'P2002', clientVersion: '1.0.0', meta: { target: ['email'] } },
    );

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.CONFLICT,
        message: 'Unique constraint failed on fields: email',
      }),
    );
    expect(logger.error).toHaveBeenCalled();
  });

  it('should handle record not found error P2025', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Record not found',
      { code: 'P2025', clientVersion: '1.0.0' },
    );

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Record not found',
      }),
    );
    expect(logger.error).toHaveBeenCalled();
  });

  it('should handle unknown DB error and call gracefulShutdown', () => {
    const gracefulShutdownMock = jest
      .spyOn(require('@/common/utils/shutdown.util'), 'gracefulShutdown')
      .mockImplementation(jest.fn());

    const exception = new Prisma.PrismaClientKnownRequestError(
      'Unknown error',
      { code: 'P9999', clientVersion: '1.0.0' },
    );

    filter.catch(exception, mockHost as ArgumentsHost);

    expect(mockRes.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unknown error',
      }),
    );
    expect(logger.error).toHaveBeenCalled();
    expect(gracefulShutdownMock).toHaveBeenCalledWith(
      logger,
      'Critical database failure — shutting down application...',
    );

    gracefulShutdownMock.mockRestore();
  });
});
