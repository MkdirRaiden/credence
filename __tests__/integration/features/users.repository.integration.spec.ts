// __tests__/integration/features/users.repository.integration.spec.ts
import { UsersRepository } from '@/features/users/repositories/users.repository';
import { PrismaService } from '@/database/prisma.service';
import { UsersModule } from '@/features/users/users.module';
import { createTestModule } from '../__helpers__/test-module.factory';
import { cleanupDatabase, disconnectDatabase } from '../__helpers__/test-database';
import { UserRole } from '@prisma/client';

jest.setTimeout(20000);

describe('UsersRepository (Integration)', () => {
  let repository: UsersRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await createTestModule({ imports: [UsersModule] });
    repository = moduleRef.get(UsersRepository);
    prisma = moduleRef.get(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  afterAll(async () => {
    await cleanupDatabase(prisma);
    await disconnectDatabase(prisma);
  });

  describe('create', () => {
    it('creates user with full and minimal data', async () => {
      const fullUser = await repository.create({
        email: 'full@example.com',
        phone: '+1234567890',
        name: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
      });

      expect(fullUser.email).toBe('full@example.com');
      expect(fullUser.phone).toBe('+1234567890');
      expect(fullUser.role).toBe(UserRole.USER);
      expect(fullUser.deletedAt).toBeNull();

      const minimalUser = await repository.create({ email: 'minimal@example.com' });
      expect(minimalUser.email).toBe('minimal@example.com');
      expect(minimalUser.phone).toBeNull();
    });
  });

  describe('findAll', () => {
    it('returns paginated users and excludes soft deleted', async () => {
      await repository.create({ email: 'user1@example.com' });
      await repository.create({ email: 'user2@example.com' });
      const deleted = await repository.create({ email: 'user3@example.com' });
      await repository.softDelete(deleted.id);

      const users = await repository.findAll(0, 10);

      expect(users).toHaveLength(2);
      expect(users[0].email).toBe('user2@example.com'); // newest first
    });
  });

  describe('findById', () => {
    it('finds existing user and throws for non-existent or deleted', async () => {
      const user = await repository.create({ email: 'find@example.com' });

      const found = await repository.findById(user.id);
      expect(found?.email).toBe('find@example.com');

      await repository.softDelete(user.id);
      await expect(repository.findById(user.id)).rejects.toThrow('User not found');
      await expect(
        repository.findById('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow('User not found');
    });
  });

  describe('findByEmail', () => {
    it('finds by email or throws when not found', async () => {
      await repository.create({ email: 'exists@example.com' });

      const found = await repository.findByEmail('exists@example.com');
      expect(found?.email).toBe('exists@example.com');

      await expect(repository.findByEmail('nope@example.com')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('findByPhone', () => {
    it('finds by phone or throws when not found', async () => {
      await repository.create({
        email: 'phone@example.com',
        phone: '+1234567890',
      });

      const found = await repository.findByPhone('+1234567890');
      expect(found?.phone).toBe('+1234567890');

      await expect(repository.findByPhone('+9999999999')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('update', () => {
    it('updates user or throws for non-existent', async () => {
      const user = await repository.create({ email: 'update@example.com' });

      const updated = await repository.update(user.id, {
        name: 'Updated Name',
        avatarUrl: 'https://new-avatar.com',
      });

      expect(updated?.name).toBe('Updated Name');
      expect(updated?.avatarUrl).toBe('https://new-avatar.com');

      await expect(
        repository.update('00000000-0000-0000-0000-000000000000', { name: 'Test' }),
      ).rejects.toThrow('User not found');
    });
  });

  describe('softDelete', () => {
    it('soft deletes and excludes from queries', async () => {
      const user = await repository.create({ email: 'delete@example.com' });

      const deleted = await repository.softDelete(user.id);
      expect(deleted?.deletedAt).toBeInstanceOf(Date);

      await expect(repository.findById(user.id)).rejects.toThrow('User not found');
    });
  });

  describe('existence checks', () => {
    it('checks email existence', async () => {
      await repository.create({ email: 'exists@example.com' });

      expect(await repository.existsByEmail('exists@example.com')).toBe(true);
      expect(await repository.existsByEmail('nope@example.com')).toBe(false);
    });

    it('checks phone existence', async () => {
      await repository.create({
        email: 'phone@example.com',
        phone: '+1111111111',
      });

      expect(await repository.existsByPhone('+1111111111')).toBe(true);
      expect(await repository.existsByPhone('+9999999999')).toBe(false);
    });
  });
});
