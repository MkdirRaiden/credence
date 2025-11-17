// src/features/shared/tokens/contracts/base-token.service.ts

export abstract class BaseTokenService {
  abstract create(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<void>;

  abstract isValidToken(userId: string, refreshToken: string): Promise<boolean>;

  abstract revoke(refreshToken: string): Promise<void>;
}
