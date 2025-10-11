import { buildResponse } from '@/common/utils/response-builder.util';

describe('buildResponse', () => {
  it('should build a successful response with provided data', () => {
    const resp = buildResponse({ id: 1 }, '/test', 200, true, 'OK');

    expect(resp.success).toBe(true);
    expect(resp.statusCode).toBe(200);
    expect(resp.message).toBe('OK');
    expect(resp.data).toEqual({ id: 1 });
    expect(resp.path).toBe('/test');
    expect(new Date(resp.timestamp).toString()).not.toBe('Invalid Date');
  });

  it('should set default message for failed response', () => {
    const resp = buildResponse(null, '/fail', 500, false);

    expect(resp.success).toBe(false);
    expect(resp.data).toBeUndefined();
    expect(resp.message).toBe('Internal server error');
  });
});
