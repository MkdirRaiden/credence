// __tests__/unit/common/interceptors/helpers/build-visibility-context.spec.ts
import { buildVisibilityContext } from '@/common/interceptors/helpers';
import type { AuthenticatedUser } from '@/common/interfaces';


describe('buildVisibilityContext Utility', () => {
  const createMockUser = (overrides?: Partial<AuthenticatedUser>): AuthenticatedUser => ({
    id: 'user_123',
    email: 'test@example.com',
    role: 'USER',
    ...overrides,
  });

  it('returns admin level when user is admin', () => {
    const user = createMockUser({ role: 'ADMIN' });
    const result = buildVisibilityContext('public', user, 'resource_456');

    expect(result.level).toBe('admin');
    expect(result.requesterId).toBe('user_123');
  });

  it('returns self level when user owns resource', () => {
    const user = createMockUser({ id: 'user_123' });
    const result = buildVisibilityContext('public', user, 'user_123');

    expect(result.level).toBe('self');
    expect(result.requesterId).toBe('user_123');
  });

  it('returns public level for unauthorized access', () => {
    const user = createMockUser({ id: 'user_123' });
    const result = buildVisibilityContext('public', user, 'resource_999');

    expect(result.level).toBe('public');
    expect(result.requesterId).toBe('user_123');
  });

  it('returns public level when no user', () => {
    const result = buildVisibilityContext('public', undefined);

    expect(result.level).toBe('public');
    expect(result.requesterId).toBeUndefined();
  });

  it('ignores declared level (always uses user role/ownership)', () => {
    const user = createMockUser({ role: 'ADMIN' });
    const result = buildVisibilityContext('public', user, 'resource_123');

    // Declared level 'public' is ignored, actual is 'admin'
    expect(result.level).toBe('admin');
  });
});
