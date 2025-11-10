// __tests__/integration/soft-delete.integration.spec.ts
import { PrismaService } from '@/database/services';
import { TestContext } from '../common/test-context';

jest.setTimeout(30000);

describe('Soft Delete Extension (Integration)', () => {
  const context = new TestContext();
  let prisma: PrismaService;

  beforeAll(async () => {
    await context.setup();
    prisma = context.prisma as PrismaService;
  });

  afterAll(async () => {
    await context.teardown();
  });

  beforeEach(async () => {
    // Clean up test users
    await prisma.user.deleteMany({ 
      where: { email: { contains: '@soft-delete-test.com' } } 
    });
  });

  describe('User model (with soft-delete)', () => {
    it('automatically filters soft-deleted records in findMany', async () => {
      // Create active user
      const active = await prisma.user.create({
        data: { 
          email: 'active@soft-delete-test.com', 
          passwordHash: 'hash' 
        },
      });

      // Create soft-deleted user
      const deleted = await prisma.user.create({
        data: {
          email: 'deleted@soft-delete-test.com',
          passwordHash: 'hash',
          deletedAt: new Date(),
        },
      });

      // findMany should only return active
      const users = await prisma.user.findMany({
        where: { email: { contains: '@soft-delete-test.com' } },
      });

      expect(users).toHaveLength(1);
      expect(users[0].id).toBe(active.id);
    });

    it('automatically filters soft-deleted records in findFirst', async () => {
      // Create soft-deleted user
      await prisma.user.create({
        data: {
          email: 'deleted@soft-delete-test.com',
          passwordHash: 'hash',
          deletedAt: new Date(),
        },
      });

      // findFirst should return null
      const user = await prisma.user.findFirst({
        where: { email: 'deleted@soft-delete-test.com' },
      });

      expect(user).toBeNull();
    });

    it('allows explicit query for deleted records', async () => {
      // Create soft-deleted user
      const deleted = await prisma.user.create({
        data: {
          email: 'deleted@soft-delete-test.com',
          passwordHash: 'hash',
          deletedAt: new Date(),
        },
      });

      // Explicitly query deleted records
      const users = await prisma.user.findMany({
        where: {
          email: 'deleted@soft-delete-test.com',
          deletedAt: { not: null },
        },
      });

      expect(users).toHaveLength(1);
      expect(users[0].id).toBe(deleted.id);
    });
  });

  describe('OtpCode model (no soft-delete)', () => {
    it('does not filter records without deletedAt field', async () => {
      // Create test user first
      const user = await prisma.user.create({
        data: { 
          email: 'otp-test@soft-delete-test.com', 
          passwordHash: 'hash' 
        },
      });

      // OtpCode doesn't have deletedAt - extension should skip it
      const otp = await prisma.otpCode.create({
        data: {
          userId: user.id,
          channel: 'EMAIL',
          codeHash: 'hashed-123456',
          expiresAt: new Date(Date.now() + 300000), // 5 minutes
        },
      });

      const found = await prisma.otpCode.findFirst({
        where: { codeHash: 'hashed-123456' },
      });

      expect(found).not.toBeNull();
      expect(found?.id).toBe(otp.id);
    });
  });
});
