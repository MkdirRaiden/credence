// src/features/users/user.config.ts
import { type VisibilityLevel } from '@/common/interfaces';
import { UserResponseDto } from '@/features/users/dtos/user-response.dto';

/**
 * Type-safe field visibility rules mapped to UserResponseDto
 * TypeScript enforces all DTO fields are configured
 * If DTO changes, this will break the build
 */
export const USER_FIELD_VISIBILITY_CONFIG: Record<
  keyof UserResponseDto,
  VisibilityLevel[]
> = {
  id: ['public', 'self', 'admin'],
  name: ['public', 'self', 'admin'],
  avatarUrl: ['public', 'self', 'admin'],
  role: ['self', 'admin'],
  email: ['self', 'admin'],
  phone: ['self', 'admin'],
  emailVerified: ['self', 'admin'],
  phoneVerified: ['self', 'admin'],
  referredById: ['self', 'admin'],
  createdAt: ['self', 'admin'],
  updatedAt: ['self', 'admin'],
};
