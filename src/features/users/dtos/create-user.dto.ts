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
import { USER_VALIDATION } from '@/features/users/users.config';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @TrimTransform
  email: string;

  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  @Matches(USER_VALIDATION.PHONE_REGEX, {
    message: 'Phone must be in valid international format',
  })
  @TrimTransform
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(USER_VALIDATION.NAME_MIN_LENGTH)
  @MaxLength(USER_VALIDATION.NAME_MAX_LENGTH)
  @TrimTransform
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar URL must be a valid URL' })
  avatarUrl?: string;

  // @IsOptional()
  // @IsString({ message: 'Referral code must be a string' })
  // @MinLength(USER_VALIDATION.REFERRAL_CODE_MIN_LENGTH)
  // @MaxLength(USER_VALIDATION.REFERRAL_CODE_MAX_LENGTH)
  // @TrimTransform
  // referralCode?: string;
}
