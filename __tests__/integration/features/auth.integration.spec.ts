// __tests__/integration/features/auth.integration.spec.ts
import { TestContext } from '../../common/test-context';
import { AuthModule } from '@/features/auth/auth.module';
import { UsersModule } from '@/features/users/users.module';
import { RefreshTokenModule } from '@/features/shared/tokens/token.module';
import { PrismaService } from '@/database/services';
import { AuthService } from '@/features/auth/services';
import { UserRole } from '@prisma/client';

describe('Auth + Users + RefreshTokens (Integration)', () => {
  const context = new TestContext();
  let prisma: PrismaService;
  let authService: AuthService;

  beforeAll(async () => {
    await context.setup({
      imports: [AuthModule, UsersModule, RefreshTokenModule],
    });

    prisma = context.prisma as PrismaService;
    authService = context.getService<AuthService>(AuthService);
  });

  afterAll(async () => {
    await context.teardown();
  });

  beforeEach(async () => {
    await prisma.refreshToken.deleteMany({});
    await prisma.user.deleteMany({
      where: { email: { contains: '@auth-int.test' } },
    });
  });

  it('register → persists user + refresh token via RefreshTokensService', async () => {
    const result = await authService.register({
      email: 'user@auth-int.test',
      password: 'Plain123!',
      username: 'auth_int_user',
      name: 'Auth Int',
      avatarUrl: undefined,
      phone: undefined,
    });

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user?.email).toBe('user@auth-int.test');

    const user = await prisma.user.findFirstOrThrow({
      where: { email: 'user@auth-int.test' },
    });

    const storedTokens = await prisma.refreshToken.findMany({
      where: { userId: user.id },
    });

    expect(storedTokens).toHaveLength(1);
    expect(storedTokens[0].isRevoked).toBe(false);
  });

  it('refresh → verifies, revokes old token, creates new one and keeps user role', async () => {
    const registered = await authService.register({
      email: 'admin@auth-int.test',
      password: 'Plain123!',
      username: 'auth_int_admin',
      name: 'Auth Admin',
      avatarUrl: undefined,
      phone: undefined,
    });

    // Make the user admin so lookupService returns role = ADMIN
    await prisma.user.updateMany({
      where: { email: 'admin@auth-int.test' },
      data: { role: UserRole.ADMIN },
    });

    const beforeTokens = await prisma.refreshToken.findMany({});
    expect(beforeTokens).toHaveLength(1);
    const oldToken = beforeTokens[0];

    const refreshed = await authService.refresh({
      refreshToken: registered.refreshToken,
    });

    expect(refreshed.accessToken).toBeDefined();
    expect(refreshed.refreshToken).toBeDefined();

    // refresh now returns a user object
    expect(refreshed.user).toBeDefined();
    expect(refreshed.user?.email).toBe('admin@auth-int.test');
    expect(refreshed.user?.role).toBe('ADMIN');

    // Verify DB role is still ADMIN
    const dbUser = await prisma.user.findFirstOrThrow({
      where: { email: 'admin@auth-int.test' },
    });
    expect(dbUser.role).toBe(UserRole.ADMIN);

    const afterTokens = await prisma.refreshToken.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // old token should be revoked, new one added
    expect(afterTokens).toHaveLength(2);
    const [old, newlyCreated] = afterTokens;
    expect(old.id).toBe(oldToken.id);
    expect(old.isRevoked).toBe(true);
    expect(newlyCreated.isRevoked).toBe(false);
  });
});
