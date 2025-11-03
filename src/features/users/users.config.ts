// src/features/users/users.config.ts
import { type VisibilityLevel } from '@/common/interfaces';
import { UserResponseDto } from '@/features/users/dtos';

/**
 * Type-safe field visibility rules mapped to UserResponseDto
 * TypeScript enforces all DTO fields are configured
 * If DTO changes, this will break the build
 */
export const USER_FIELD_VISIBILITY_CONFIG: Record<
  keyof UserResponseDto,
  VisibilityLevel[]
> = {
  id: ['public', 'admin'],
  name: ['public', 'admin'],
  avatarUrl: ['public', 'admin'],
  role: ['admin'],
  email: ['admin'],
  phone: ['admin'],
  emailVerified: ['admin'],
  phoneVerified: ['admin'],
  referredById: ['admin'],
  createdAt: ['admin'],
  updatedAt: ['admin'],
};

/**
 * Prisma select object for auth queries (findByEmailForAuth)
 * Includes all fields needed for authentication: safe fields + sensitive (passwordHash) + relations (refreshTokens)
 * Used internally by Auth module (bypasses visibility config)
 */
export const AUTH_USER_SELECT = {
  id: true,
  email: true,
  phone: true,
  name: true,
  avatarUrl: true,
  emailVerified: true,
  phoneVerified: true,
  role: true,
  referredById: true,
  passwordHash: true, // Sensitive: Needed for password verification
  refreshTokens: {
    // Relation: For token management (login/refresh/logout)
    select: {
      id: true,
      tokenHash: true,
      expiresAt: true,
      createdAt: true,
      isRevoked: true,
    },
  },
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const; // as const for type safety
