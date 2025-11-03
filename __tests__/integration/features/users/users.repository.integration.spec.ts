// __tests__/integration/features/users/users.repository.integration.spec.ts
import { PrismaService } from '@/database/prisma.service';
import { UsersRepository } from '@/features/users/users.repository';
import { createTestModule } from '../../../helpers/test-module.factory';
import { cleanupDatabase, disconnectDatabase } from '../../../helpers/test-database';
import { UsersModule } from '@/features/users/users.module';

describe('UsersRepository (Integration)', () => {
  let prisma: PrismaService;
  let repository: UsersRepository;

  beforeAll(async () => {
    const module = await createTestModule({
      imports: [UsersModule],
    });
    prisma = module.get(PrismaService);
    repository = module.get(UsersRepository);
  });

  afterAll(async () => {
    await cleanupDatabase(prisma);
    await disconnectDatabase(prisma);
  });

  afterEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('create', () => {
    it('creates user in database', async () => {
      const result = await repository.create({
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(result.id).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
    });
  });

  describe('findById', () => {
    it('finds user by id with public visibility', async () => {
      const user = await prisma.user.create({
        data: { email: 'test@example.com', name: 'Test' },
      });

      const result = await repository.findById(user.id, {
        level: 'public',
        skip: 0,
        take: 10,
      });

      expect(result.id).toBe(user.id);
      expect(result.name).toBe('Test');
      expect(result.email).toBeUndefined();
    });

    it('finds user by id with admin visibility', async () => {
      const user = await prisma.user.create({
        data: { email: 'admin@example.com', name: 'Admin Test' },
      });

      const result = await repository.findById(user.id, {
        level: 'admin',
        skip: 0,
        take: 10,
      });

      expect(result.id).toBe(user.id);
      expect(result.email).toBe('admin@example.com');
    });
  });

  describe('findByEmail', () => {
    it('finds user by email with admin context', async () => {
      const user = await prisma.user.create({
        data: { email: 'test@example.com' },
      });

      const result = await repository.findByEmail('test@example.com', {
        level: 'admin',
        skip: 0,
        take: 10,
      });

      expect(result.email).toBe('test@example.com');
    });
  });

  describe('findByPhone', () => {
    it('finds user by phone with admin context', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          phone: '+1234567890',
        },
      });

      const result = await repository.findByPhone('+1234567890', {
        level: 'admin',
        skip: 0,
        take: 10,
      });

      expect(result.phone).toBe('+1234567890');
    });
  });

  describe('findAll', () => {
    it('returns paginated users with public visibility', async () => {
      await prisma.user.createMany({
        data: [
          { email: 'user1@example.com', name: 'User One' },
          { email: 'user2@example.com', name: 'User Two' },
        ],
      });

      const result = await repository.findAll({
        level: 'public',
        skip: 0,
        take: 10,
      });

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('User One');
      expect(result[0].email).toBeUndefined();
    });

    it('respects pagination skip and take', async () => {
      await prisma.user.createMany({
        data: [
          { email: 'user1@example.com' },
          { email: 'user2@example.com' },
          { email: 'user3@example.com' },
        ],
      });

      const result = await repository.findAll({
        level: 'public',
        skip: 1,
        take: 1,
      });

      expect(result).toHaveLength(1);
    });
  });

  describe('update', () => {
    it('updates user', async () => {
      const user = await prisma.user.create({
        data: { email: 'test@example.com' },
      });

      const result = await repository.update(user.id, { name: 'Updated' });

      expect(result.name).toBe('Updated');
      expect(result.id).toBe(user.id);
    });
  });

  describe('softDelete', () => {
    it('soft deletes user', async () => {
      const user = await prisma.user.create({
        data: { email: 'test@example.com' },
      });

      await repository.softDelete(user.id);

      const deleted = await prisma.user.findUnique({
        where: { id: user.id },
      });

      expect(deleted!.deletedAt).toBeDefined();
    });
  });

  describe('findByEmailForAuth', () => {
    it('returns user with sensitive fields (passwordHash)', async () => {
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed_pw_123',
        },
      });

      const result = await repository.findByEmailForAuth('test@example.com');

      expect(result.email).toBe('test@example.com');
      expect(result.passwordHash).toBe('hashed_pw_123');
    });
  });
});
