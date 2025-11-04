// src/features/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '@/features/auth/auth.controller';
import { AuthService } from '@/features/auth/auth.service';
import { LocalStrategy, JwtStrategy } from '@/features/auth/strategies';
import { UsersModule } from '@/features/users/users.module';
import type { AppConfig } from '@/common/interfaces/app-config.interface';
import { JWT_EXPIRATION } from '@/common/constants';
import {
  LocalAuthGuard,
  JwtAuthGuard,
  RolesGuard,
  OptionalJwtAuthGuard,
} from '@/features/auth/guards';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        return {
          secret: configService.get('jwtSecret', { infer: true }),
          signOptions: { expiresIn: JWT_EXPIRATION },
        };
      },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
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
