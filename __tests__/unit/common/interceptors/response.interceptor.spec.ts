import {
  ResponseInterceptor,
  StandardResponse,
} from '@/common/interceptors/response.interceptor';
import { LoggerService } from '@/logger/logger.service';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, lastValueFrom } from 'rxjs';
import { Request, Response } from 'express';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let logger: LoggerService;

  const mockRequest: Partial<Request> = { method: 'GET', url: '/test-url' };
  const mockResponse: Partial<Response> = {
    statusCode: 200,
    setHeader: jest.fn(),
  };

  const mockCallHandler: Partial<CallHandler> = {
    handle: jest.fn().mockReturnValue(of({ key: 'value' })),
  };

  const mockExecutionContext: Partial<ExecutionContext> = {
    switchToHttp: () =>
      ({
        getRequest: () => mockRequest as Request,
        getResponse: () => mockResponse as Response,
        getNext: () => ({}),
      }) as any, // <--- use 'any' here
  };

  beforeEach(() => {
    logger = {
      debug: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
    } as unknown as LoggerService;

    interceptor = new ResponseInterceptor(logger);
    jest.clearAllMocks();
  });

  it('should format the response and log correctly', async () => {
    const result: StandardResponse<any> = await lastValueFrom(
      interceptor.intercept(
        mockExecutionContext as unknown as ExecutionContext, // <--- cast here
        mockCallHandler as CallHandler,
      ),
    );

    expect(result).toMatchObject({
      success: true,
      statusCode: mockResponse.statusCode,
      data: { key: 'value' },
      message: 'Request successful',
      path: '/test-url',
    });

    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'X-API-Version',
      '1.0.0',
    );
    expect(logger.debug).toHaveBeenCalled();
  });
});
