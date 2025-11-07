// src/features/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '@/features/auth/auth.controller';
import * as services from '@/features/auth/services';
import * as strategies from '@/features/auth/strategies';
import * as guards from '@/features/auth/guards';
import { UsersModule } from '@/features/users/users.module';
import { RefreshTokenModule } from '@/features/refresh-tokens/refresh-token.module';
import type { AppConfig } from '@/common/interfaces';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const jwtConfig = configService.get('jwt', { infer: true });
        return {
          secret: jwtConfig.jwtSecret,
          signOptions: { expiresIn: jwtConfig.jwtExpiration },
        };
      },
    }),
    UsersModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [
    services.AuthService,
    services.CredentialsService,
    strategies.LocalStrategy,
    strategies.JwtStrategy,
    guards.LocalAuthGuard,
    guards.JwtAuthGuard,
    guards.RolesGuard,
    guards.OptionalJwtAuthGuard,
  ],
  exports: [
    services.AuthService,
    guards.LocalAuthGuard,
    guards.JwtAuthGuard,
    guards.RolesGuard,
    guards.OptionalJwtAuthGuard,
  ],
})
export class AuthModule {}
