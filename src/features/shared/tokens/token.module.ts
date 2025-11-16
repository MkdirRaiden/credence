// src/features/shared/tokens/refresh-token.module.ts
import { Module } from '@nestjs/common';
import { RefreshTokenService } from '@/features/shared/tokens/services';
import { RefreshTokenRepository } from '@/features/shared/tokens/repositories';
import { BaseTokenService } from '@/features/shared/tokens/contracts';

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
