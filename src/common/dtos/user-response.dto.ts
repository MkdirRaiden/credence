// src/common/dtos/user-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    example: '8f14e45f-ea3b-4a14-9c4f-123456789abc',
    description: 'Unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiPropertyOptional({
    example: 'johndoe',
    description: 'Public username of the user',
  })
  username?: string;

  @ApiPropertyOptional({
    example: '+14155552671',
    description: 'Phone number in international format',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Display name of the user',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatars/johndoe.png',
    description: 'Public avatar URL of the user',
  })
  avatarUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the email has been verified',
  })
  emailVerified: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the phone number has been verified',
  })
  phoneVerified: boolean;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Role of the user',
  })
  role: UserRole;

  @ApiPropertyOptional({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'ID of the user who referred this user (if any)',
  })
  referredById?: string;

  @ApiProperty({
    example: '2025-11-18T01:23:45.000Z',
    description: 'Timestamp when the user was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-11-18T02:34:56.000Z',
    description: 'Timestamp when the user was last updated',
  })
  updatedAt: Date;
}
