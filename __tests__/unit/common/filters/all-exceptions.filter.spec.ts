import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { LoggerService } from '@/logger/logger.service';

jest.mock('@/common/utils/response-builder.util');

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockLogger: LoggerService;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    mockLogger = { error: jest.fn() } as any;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockRequest = { url: '/test' };
    mockHost = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    } as any;

    filter = new AllExceptionsFilter(mockLogger);
    jest.spyOn(filter as any, 'handleResponse').mockImplementation(() => {});
  });

  afterEach(() => jest.clearAllMocks());

  it('should skip favicon.ico requests', () => {
    mockRequest.url = '/favicon.ico';
    filter.catch(new Error('ignore'), mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(204);
    expect(mockResponse.send).toHaveBeenCalled();
    expect((filter as any).handleResponse).not.toHaveBeenCalled();
  });

  it('should handle HttpException with string response', () => {
    const httpException = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    filter.catch(httpException, mockHost);

    expect((filter as any).handleResponse).toHaveBeenCalledWith(
      mockHost,
      HttpStatus.FORBIDDEN,
      'Forbidden',
      httpException,
    );
  });

  it('should handle HttpException with object response containing message', () => {
    const httpException = new HttpException(
      { message: 'Bad Request' },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(httpException, mockHost);

    expect((filter as any).handleResponse).toHaveBeenCalledWith(
      mockHost,
      HttpStatus.BAD_REQUEST,
      'Bad Request',
      httpException,
    );
  });

  it('should handle generic Error', () => {
    const err = new Error('Boom');
    filter.catch(err, mockHost);

    expect((filter as any).handleResponse).toHaveBeenCalledWith(
      mockHost,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Boom',
      err,
    );
  });

  it('should handle unknown exception safely', () => {
    filter.catch({} as any, mockHost);

    expect((filter as any).handleResponse).toHaveBeenCalledWith(
      mockHost,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
      {},
    );
  });
});
