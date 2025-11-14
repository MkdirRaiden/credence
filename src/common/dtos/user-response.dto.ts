import { UserRole } from '@prisma/client';

// src/common/dtos/user-response.dto.ts
export class UserResponseDto {
  id: string;
  email: string;
  username?: string;
  phone?: string;
  name?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: UserRole;
  referredById?: string;
  createdAt: Date;
  updatedAt: Date;
}
