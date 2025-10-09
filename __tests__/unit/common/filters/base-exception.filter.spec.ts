import { ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@/common/filters/base-exception.filter';
import { LoggerService } from '@/logger/logger.service';
import { buildResponse } from '@/common/utils/response-builder.util';

jest.mock('@/common/utils/response-builder.util');

class TestFilter extends BaseExceptionFilter {
  catch() {}
}

describe('BaseExceptionFilter', () => {
  let filter: TestFilter;
  let logger: LoggerService;
  let host: ArgumentsHost;
  let response: any;

  beforeEach(() => {
    logger = { error: jest.fn() } as any;
    response = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    host = {
      switchToHttp: () => ({
        getRequest: () => ({ url: '/test' }),
        getResponse: () => response,
      }),
    } as any;

    filter = new TestFilter(logger);
    (buildResponse as jest.Mock).mockReturnValue({ mock: 'response' });
  });

  it('should handle response correctly', () => {
    const err = new Error('Boom');
    filter['handleResponse'](host, 500, 'Error occurred', err);

    expect(logger.error).toHaveBeenCalledWith(
      'Error occurred',
      err.stack,
      'TestFilter',
    );
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ mock: 'response' });
  });

  it('should not throw if exception is not Error', () => {
    filter['handleResponse'](host, 400, 'Bad', { foo: 'bar' } as any);
    expect(logger.error).toHaveBeenCalled();
  });
});
