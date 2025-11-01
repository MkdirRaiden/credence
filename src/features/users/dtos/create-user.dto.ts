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
  @IsEmail({}, { message: 'Invalid email format' })
  @TrimTransform
  email: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone must be in valid international format',
  })
  @TrimTransform
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @TrimTransform
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;

  @IsOptional()
  @IsString({ message: 'Referral code must be a string' })
  @MinLength(3, { message: 'Referral code must be at least 3 characters' })
  @MaxLength(50, { message: 'Referral code must not exceed 50 characters' })
  @TrimTransform
  referralCode?: string;
}
