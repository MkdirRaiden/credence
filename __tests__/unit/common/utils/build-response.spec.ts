// __tests__/unit/common/utils/build-response.spec.ts
import { buildResponse } from '@/common/utils/response-builder';

describe('buildResponse', () => {
  it('✅ builds success response with defaults', () => {
    const result = buildResponse({ id: 1 }, '/test', 200);

    expect(result.success).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.message).toBe('Request successful');
    expect(result.data).toEqual({ id: 1 });
    expect(result.path).toBe('/test');
    expect(result.timestamp).toBeDefined();
  });

  it('✅ builds error response with custom message', () => {
    const result = buildResponse(null, '/fail', 500, false, 'DB error');

    expect(result.success).toBe(false);
    expect(result.message).toBe('DB error');
    expect(result.data).toBeUndefined();
  });

  it('✅ uses default error message when not provided', () => {
    const result = buildResponse(null, '/fail', 500, false);
    expect(result.message).toBe('Internal server error');
  });
});
