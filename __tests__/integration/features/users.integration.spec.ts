// __tests__/integration/features/users.integration.spec.ts
import { UserRole } from '@prisma/client';
import { PrismaService } from '@/database/services';
import { UsersModule } from '@/features/users/users.module';
import { UsersLookupService } from '@/features/users/services';
import { TestContext } from '../../common/test-context';

describe('UsersModule (Integration)', () => {
  const context = new TestContext();

  let prisma: PrismaService;
  let lookupService: UsersLookupService;

  beforeAll(async () => {
    await context.setup({
      imports: [UsersModule],
    });

    prisma = context.prisma as PrismaService;
    lookupService = context.getService<UsersLookupService>(UsersLookupService);
  });

  afterAll(async () => {
    await context.teardown();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('findById respects public vs self vs admin visibility', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'user.integration@example.com',
        username: 'user_integration',
        passwordHash: 'hashed',
        role: UserRole.USER,
        authProvider: 'LOCAL',
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: 'admin.integration@example.com',
        username: 'admin_integration',
        passwordHash: 'hashed',
        role: UserRole.ADMIN,
        authProvider: 'LOCAL',
      },
    });

    const publicContext = {
      level: 'public' as const,
      skip: 0,
      take: 10,
    };

    const publicResult = await lookupService.findById(user.id, publicContext);

    expect(publicResult.id).toBe(user.id);
    expect(publicResult.username).toBe('user_integration');
    expect((publicResult as any).email).toBeUndefined();
    expect((publicResult as any).phone).toBeUndefined();
    expect((publicResult as any).role).toBeUndefined();

    const selfContext = {
      level: 'self' as const,
      requesterId: user.id,
      skip: 0,
      take: 10,
    };

    const selfResult = await lookupService.findById(user.id, selfContext);

    expect(selfResult.id).toBe(user.id);
    expect(selfResult.email).toBe('user.integration@example.com');
    expect(selfResult.role).toBe('USER');
    expect((selfResult as any).passwordHash).toBeUndefined();

    const adminContext = {
      level: 'admin' as const,
      requesterId: admin.id,
      skip: 0,
      take: 10,
    };

    const adminResult = await lookupService.findById(user.id, adminContext);

    expect(adminResult.id).toBe(user.id);
    expect(adminResult.email).toBe('user.integration@example.com');
    expect(adminResult.role).toBe('USER');
    expect((adminResult as any).passwordHash).toBeUndefined();
  });

  it('findAll applies pagination and returns DTOs without sensitive fields', async () => {
    await prisma.user.createMany({
      data: Array.from({ length: 15 }).map((_, i) => ({
        email: `u${i}.integration@example.com`,
        username: `user_${i}`,
        passwordHash: 'hashed',
        role: UserRole.USER,
        authProvider: 'LOCAL',
      })),
    });

    const contextWithPagination = {
      level: 'public' as const,
      skip: 5,
      take: 5,
    };

    const results = await lookupService.findAll(contextWithPagination);

    expect(results).toHaveLength(5);
    expect(results[0].username).toBe('user_5');
    expect((results[0] as any).passwordHash).toBeUndefined();
    expect((results[0] as any).deletedAt).toBeUndefined();
  });
});
