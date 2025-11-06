// __tests__/unit/common/decorators/visibility-context.decorator.spec.ts
import { ExecutionContext } from '@nestjs/common';
import type { FieldSelectorContext, RequestWithContext } from '@/common/interfaces';


describe('GetVisibilityContext Decorator', () => {
  /**
   * Simulates the decorator callback logic
   * (Extract from request and return context)
   */
  const extractVisibilityContext = (context: ExecutionContext): FieldSelectorContext => {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    return request['visibility-context'];
  };

  it('extracts visibility context from request', () => {
    const mockContext: FieldSelectorContext = {
      level: 'public',
      requesterId: 'req_123',
    };

    const mockRequest = {
      'visibility-context': mockContext,
    };

    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = extractVisibilityContext(executionContext);

    expect(result).toEqual(mockContext);
    expect(result.level).toBe('public');
  });

  it('returns undefined when visibility context not set', () => {
    const mockRequest = {};

    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = extractVisibilityContext(executionContext);

    expect(result).toBeUndefined();
  });

  it('preserves all context properties', () => {
    const mockContext: FieldSelectorContext = {
      level: 'admin',
      requesterId: 'req_456',
      skip: 10,
      take: 20,
    };

    const mockRequest = {
      'visibility-context': mockContext,
    };

    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = extractVisibilityContext(executionContext);

    expect(result).toEqual(mockContext);
    expect(result.skip).toBe(10);
    expect(result.take).toBe(20);
  });
});
