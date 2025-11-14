// src/features/contracts/base-token.service.ts

export abstract class BaseTokenService {
  abstract create(
    userId: string,
    refreshToken: string,
    expiresAt: Date,
  ): Promise<void>;

  abstract verify(userId: string, refreshToken: string): Promise<void>;

  abstract revoke(refreshToken: string): Promise<void>;
}
