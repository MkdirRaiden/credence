// src/feature/shared/security/security.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import * as guards from '@/features/shared/security/guards';

@Module({
  imports: [PassportModule],

  providers: [
    guards.LocalAuthGuard,
    guards.JwtAuthGuard,
    guards.RolesGuard,
    guards.OwnershipGuard,
    guards.OptionalJwtAuthGuard,
  ],

  exports: [
    guards.LocalAuthGuard,
    guards.JwtAuthGuard,
    guards.RolesGuard,
    guards.OwnershipGuard,
    guards.OptionalJwtAuthGuard,
  ],
})
export class SecurityModule {}
