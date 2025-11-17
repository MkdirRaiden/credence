// src/features/auth/dtos/auth-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@/features/auth/dtos';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    example: 900,
    description: 'Access token expiration time in seconds',
  })
  expiresIn: number;

  @ApiProperty({
    example: 'Bearer',
    required: false,
    description: 'Token type used in the Authorization header',
  })
  tokenType?: string;

  @ApiProperty({
    type: () => UserResponseDto,
    required: false,
    description: 'Authenticated user profile',
  })
  user?: UserResponseDto;
}
