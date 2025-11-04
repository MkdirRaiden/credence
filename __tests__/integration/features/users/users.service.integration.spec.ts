// __tests__/integration/features/users/users.service.integration.spec.ts
import { PrismaService } from '@/database/prisma.service';
import { UsersService } from '@/features/users/services/users.service';
import { LoggerService } from '@/logger/logger.service';
import { createTestModule } from '../../../helpers/test-module.factory';
import { cleanupDatabase, disconnectDatabase } from '../../../helpers/test-database';
import { UsersModule } from '@/features/users/users.module';

describe('UsersService (Integration)', () => {
  let prisma: PrismaService;
  let service: UsersService;
  let logger: LoggerService;

  beforeAll(async () => {
    const module = await createTestModule({
      imports: [UsersModule],
    });
    prisma = module.get(PrismaService);
    service = module.get(UsersService);
    logger = module.get(LoggerService);
  });

  afterAll(async () => {
    await cleanupDatabase(prisma);
    await disconnectDatabase(prisma);
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('create', () => {
    it('creates user and returns mapped response', async () => {
      const dto = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = await service.create(dto);

      expect(result.id).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('findAll', () => {
    it('returns paginated users with context', async () => {
      await prisma.user.createMany({
        data: [
          { email: 'user1@example.com' },
          { email: 'user2@example.com' },
        ],
      });

      const result = await service.findAll({
        level: 'public',
        skip: 0,
        take: 10,
      });

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('passwordHash');
    });
  });

  describe('findById', () => {
    it('finds user by id with visibility', async () => {
      const user = await prisma.user.create({
        data: { email: 'test@example.com' },
      });

      const result = await service.findById(user.id, {
        level: 'public',
        skip: 0,
        take: 10,
      });

      expect(result.id).toBe(user.id);
    });
  });

  describe('update', () => {
    it('updates user', async () => {
      const user = await prisma.user.create({
        data: { email: 'test@example.com' },
      });

      const result = await service.update(user.id, { name: 'Updated' });

      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('soft deletes user', async () => {
      const user = await prisma.user.create({
        data: { email: 'test@example.com' },
      });

      await service.remove(user.id);

      const deleted = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(deleted!.deletedAt).toBeDefined();
    });
  });

  describe('findByEmailForAuth', () => {
    it('returns user with sensitive fields', async () => {
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed_pw',
        },
      });

      const result = await service.findByEmailForAuth('test@example.com');

      expect(result.passwordHash).toBe('hashed_pw');
    });
  });
});
