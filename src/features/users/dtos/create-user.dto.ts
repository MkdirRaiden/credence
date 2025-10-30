// src/features/users/dtos/create-user.dto.ts
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsUrl,
} from 'class-validator';
import { TrimTransform } from '@/common/decorators';

export class CreateUserDto {
  @IsEmail()
  @TrimTransform
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone must be in valid international format',
  })
  @TrimTransform
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @TrimTransform
  name?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @TrimTransform
  referralCode?: string;
}
