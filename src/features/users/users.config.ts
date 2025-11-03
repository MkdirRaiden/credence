// src/features/users/users.config.ts
import { type VisibilityLevel } from '@/common/interfaces';
import { UserResponseDto } from '@/features/users/dtos';

/**
 * Type-safe field visibility rules mapped to UserResponseDto.
 * TypeScript enforces all DTO fields are configured.
 * If DTO changes, this will break the build.
 */
export const USER_FIELD_VISIBILITY_CONFIG: Record<
  keyof UserResponseDto,
  VisibilityLevel[]
> = {
  id: ['public', 'self', 'admin'],
  name: ['public', 'self', 'admin'],
  avatarUrl: ['public', 'self', 'admin'],
  email: ['self', 'admin'],
  phone: ['self', 'admin'],
  emailVerified: ['self', 'admin'],
  phoneVerified: ['self', 'admin'],
  role: ['self', 'admin'],
  referredById: ['self', 'admin'],
  createdAt: ['self', 'admin'],
  updatedAt: ['self', 'admin'],
};

/**
 * Validation constraints for user fields.
 */
export const USER_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  REFERRAL_CODE_MIN_LENGTH: 3,
  REFERRAL_CODE_MAX_LENGTH: 50,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
  AVATAR_URL_MAX_LENGTH: 2000,
} as const;

/**
 * Pagination constraints.
 */
export const PAGINATION_LIMITS = {
  MAX_SKIP: 10000,
  MAX_TAKE: 100,
  DEFAULT_SKIP: 0,
  DEFAULT_TAKE: 10,
} as const;

/**
 * Prisma select for auth queries (findByEmailForAuth).
 * Includes all fields for authentication: safe + sensitive (passwordHash) + relations (refreshTokens).
 * Used internally by Auth module (bypasses visibility config).
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
  passwordHash: true, // Sensitive: Password verification
  refreshTokens: {
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
} as const;
