// src/features/users/dtos/user-response.dto.ts
export class UserResponseDto {
  id: string;
  email: string;
  phone?: string;
  name?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  referredById?: string;
  createdAt: Date;
  updatedAt: Date;
}
