// src/features/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '@/features/auth/auth.controller';
import { AuthService, CredentialsService } from '@/features/auth/services';
import { LocalStrategy, JwtStrategy } from '@/features/auth/strategies';
import {
  LocalAuthGuard,
  JwtAuthGuard,
  RolesGuard,
  OptionalJwtAuthGuard,
} from '@/features/auth/guards';
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
    AuthService,
    CredentialsService,
    LocalStrategy,
    JwtStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    RolesGuard,
    OptionalJwtAuthGuard,
  ],
  exports: [
    AuthService,
    LocalAuthGuard,
    JwtAuthGuard,
    RolesGuard,
    OptionalJwtAuthGuard,
  ],
})
export class AuthModule {}
