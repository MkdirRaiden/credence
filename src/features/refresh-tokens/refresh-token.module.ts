// src/features/refresh-tokens/refresh-token.module.ts
import { Module } from '@nestjs/common';
import { RefreshTokenService } from '@/features/refresh-tokens/services';
import { RefreshTokenRepository } from '@/features/refresh-tokens/repositories';
import { BaseTokenService } from '@/features/refresh-tokens/contracts';

@Module({
  providers: [
    RefreshTokenRepository,
    RefreshTokenService,
    {
      provide: BaseTokenService,
      useClass: RefreshTokenService,
    },
  ],
  exports: [BaseTokenService],
})
export class RefreshTokenModule {}
