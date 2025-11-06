// __tests__/unit/common/utils/extract-resource-id.spec.ts
import { extractResourceId } from '@/common/utils';
import type { Request } from 'express';


describe('extractResourceId Utility', () => {
  it('extracts ID from params.id', () => {
    const mockRequest = {
      params: { id: 'user_123' },
      query: {},
    } as unknown as Request;

    const result = extractResourceId(mockRequest);
    expect(result).toBe('user_123');
  });

  it('extracts userId from query when params.id missing', () => {
    const mockRequest = {
      params: {},
      query: { userId: 'user_456' },
    } as unknown as Request;

    const result = extractResourceId(mockRequest);
    expect(result).toBe('user_456');
  });

  it('prioritizes params.id over query.userId', () => {
    const mockRequest = {
      params: { id: 'param_id' },
      query: { userId: 'query_id' },
    } as unknown as Request;

    const result = extractResourceId(mockRequest);
    expect(result).toBe('param_id');
  });

  it('returns undefined when neither id nor userId present', () => {
    const mockRequest = {
      params: {},
      query: {},
    } as unknown as Request;

    const result = extractResourceId(mockRequest);
    expect(result).toBeUndefined();
  });

  it('ignores non-string values', () => {
    const mockRequest = {
      params: { id: ['array', 'value'] },
      query: { userId: { nested: 'object' } },
    } as unknown as Request;

    const result = extractResourceId(mockRequest);
    expect(result).toBeUndefined();
  });
});
