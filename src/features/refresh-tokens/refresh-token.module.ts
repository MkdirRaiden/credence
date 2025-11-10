// src/features/refresh-tokens/refresh-token.module.ts
import { Module } from '@nestjs/common';
import { RefreshTokenService } from '@/features/refresh-tokens/services';
import { RefreshTokenRepository } from '@/features/refresh-tokens/repositories';

@Module({
  providers: [RefreshTokenRepository, RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
