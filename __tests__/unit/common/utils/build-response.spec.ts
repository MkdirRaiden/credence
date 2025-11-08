// __tests__/unit/common/utils/response-builder.spec.ts
import { buildResponse } from '@/common/utils';

describe('buildResponse Utility', () => {
  it('builds success response (statusCode < 400)', () => {
    const result = buildResponse({ id: 1 }, '/test', 200, 'Custom message');

    expect(result.success).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.message).toBe('Custom message');
    expect(result.data).toEqual({ id: 1 });
    expect(result.path).toBe('/test');
    expect(result.timestamp).toBeDefined();
  });

  it('builds error response (statusCode >= 400)', () => {
    const resultWithMessage = buildResponse(null, '/fail', 500, 'DB error');
    expect(resultWithMessage.success).toBe(false);
    expect(resultWithMessage.message).toBe('DB error');
    expect(resultWithMessage.data).toBeUndefined();

    const resultDefault = buildResponse(null, '/fail', 400);
    expect(resultDefault.success).toBe(false);
    expect(resultDefault.message).toBe('Internal server error');
  });

  it('uses default success message when not provided', () => {
    const result = buildResponse({ test: true }, '/api', 201);
    expect(result.message).toBe('Request successful');
  });
});
