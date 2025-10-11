import { ValidationExceptionFilter } from '@/common/filters/validation-exception.filter';
import { BadRequestException } from '@nestjs/common';

describe('ValidationExceptionFilter', () => {
  let filter: ValidationExceptionFilter;
  let mockLogger: any;
  let mockResponse: any;
  let mockRequest: any;
  let mockHost: any;

  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test-url',
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
        getNext: () => undefined,
      }),
    };

    filter = new ValidationExceptionFilter(mockLogger);
  });

  it('should handle string message', () => {
    const exception = new BadRequestException('Some error occurred');

    filter.catch(exception, mockHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        data: undefined, // matches actual buildResponse
        path: '/test-url',
        timestamp: expect.any(String),
      }),
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle array message', () => {
    const exception = new BadRequestException(['Error 1', 'Error 2']);

    filter.catch(exception, mockHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        data: undefined,
        path: '/test-url',
        timestamp: expect.any(String),
      }),
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('should handle object with message property', () => {
    const exception = new BadRequestException({ message: 'Custom error' });

    filter.catch(exception, mockHost as any);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        data: undefined,
        path: '/test-url',
        timestamp: expect.any(String),
      }),
    );
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
