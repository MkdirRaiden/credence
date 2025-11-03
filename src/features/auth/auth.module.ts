// src/features/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '@/features/auth/auth.controller';
import { AuthService } from '@/features/auth/auth.service';
import { LocalStrategy } from '@/features/auth/strategies/local.strategy';
import { JwtStrategy } from '@/features/auth/strategies/jwt.strategy';
import { LocalAuthGuard } from '@/features/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@/features/auth/guards/jwt-auth.guard';
import { UsersModule } from '@/features/users/users.module';
import type { AppConfig } from '@/common/interfaces/app-config.interface';
import { JWT_EXPIRATION } from '@/common/constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const jwtSecret = configService.get('jwtSecret', {
          infer: true,
        });
        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: JWT_EXPIRATION,
          },
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
  ],
  exports: [AuthService, LocalAuthGuard, JwtAuthGuard],
})
export class AuthModule {}
