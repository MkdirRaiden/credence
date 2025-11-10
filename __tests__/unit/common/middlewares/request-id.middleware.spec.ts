// __tests__/unit/common/middlewares/request-id.middleware.spec.ts
import { RequestIdMiddleware } from '@/common/middlewares/request-id.middleware';
import { requestContext } from '@/common/utils';
import type { Request, Response } from 'express';

describe('RequestIdMiddleware', () => {
  let middleware: RequestIdMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    middleware = new RequestIdMiddleware();
    mockRequest = { headers: {} };
    mockResponse = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('uses existing x-request-id header when present', () => {
    mockRequest.headers = { 'x-request-id': 'req_existing_123' };

    let capturedContext: any;
    const mockNext = jest.fn(() => {
      capturedContext = requestContext.getStore();
    });

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(capturedContext?.requestId).toBe('req_existing_123');
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('generates new UUID when x-request-id header missing', () => {
    let capturedContext: any;
    const mockNext = jest.fn(() => {
      capturedContext = requestContext.getStore();
    });

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(capturedContext?.requestId).toBeDefined();
    expect(capturedContext?.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('stores requestId in AsyncLocalStorage context during next()', () => {
    mockRequest.headers = { 'x-request-id': 'req_test_456' };

    let capturedContext: any;
    const mockNext = jest.fn(() => {
      capturedContext = requestContext.getStore();
    });

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(capturedContext).toBeDefined();
    expect(capturedContext?.requestId).toBe('req_test_456');
  });
});
