// src/features/auth/helpers/validate-credentials.ts
import { BaseUserService } from '@/features/users/base-user.service';
import { UserResponseDto } from '@/features/users/dtos';
import { verifyPassword } from '@/features/auth/helpers';

/**
 * Validate user credentials using email OR username + password
 * Returns user without passwordHash if valid, null otherwise
 */
export async function validateUserCredentials(
  emailOrUsername: string,
  password: string,
  userService: BaseUserService,
): Promise<Partial<UserResponseDto> | null> {
  try {
    let user;

    if (emailOrUsername.includes('@')) {
      user = await userService.findByEmailForAuth(emailOrUsername);
    } else {
      user = await userService.findByUsernameForAuth(emailOrUsername);
    }

    if (!user.passwordHash) return null;

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result as Partial<UserResponseDto>;
  } catch {
    return null;
  }
}
