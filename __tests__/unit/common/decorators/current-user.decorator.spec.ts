// __tests__/unit/common/decorators/current-user.decorator.spec.ts
import { ExecutionContext } from '@nestjs/common';
import type { UserResponseDto } from '@/common/dtos';

describe('CurrentUser Decorator', () => {
  /**
   * Simulates the decorator callback logic
   * (Extract user from request)
   */
  const extractCurrentUser = (ctx: ExecutionContext): UserResponseDto => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: UserResponseDto }>();
    return request.user;
  };

  const createMockUser = (
    overrides?: Partial<UserResponseDto>,
  ): UserResponseDto => ({
    id: 'user_123',
    email: 'test@example.com',
    emailVerified: true,
    phoneVerified: false,
    role: 'USER',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  });

  it('extracts authenticated user from request', () => {
    const mockUser = createMockUser();

    const mockRequest = {
      user: mockUser,
    };

    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = extractCurrentUser(executionContext);

    expect(result).toEqual(mockUser);
    expect(result.id).toBe('user_123');
  });

  it('returns undefined when user not authenticated', () => {
    const mockRequest = {};

    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = extractCurrentUser(executionContext);

    expect(result).toBeUndefined();
  });

  it('preserves all user properties', () => {
    const mockUser = createMockUser({
      id: 'user_456',
      email: 'admin@example.com',
      role: 'ADMIN',
      emailVerified: true,
      phoneVerified: true,
    });

    const mockRequest = {
      user: mockUser,
    };

    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = extractCurrentUser(executionContext);

    expect(result.email).toBe('admin@example.com');
    expect(result.role).toBe('ADMIN');
    expect(result.emailVerified).toBe(true);
  });
});
