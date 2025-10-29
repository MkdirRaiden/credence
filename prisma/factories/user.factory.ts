// prisma/factories/user.factory.ts
import { Prisma, UserRole } from '@prisma/client';

export const seedUsers: Prisma.UserCreateInput[] = [
  {
    email: 'admin@credence.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
    emailVerified: true,
    phoneVerified: false,
  },
  {
    email: 'john@example.com',
    name: 'John Doe',
    phone: '+1234567890',
    role: UserRole.USER,
    emailVerified: true,
    phoneVerified: true,
  },
  {
    email: 'jane@example.com',
    name: 'Jane Smith',
    phone: '+9876543210',
    role: UserRole.USER,
    emailVerified: true,
    phoneVerified: false,
  },
];
