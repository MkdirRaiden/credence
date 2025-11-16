// src/features/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '@/features/auth/auth.controller';
import * as services from '@/features/auth/services';
import * as strategies from '@/features/auth/strategies';
import { UsersModule } from '@/features/users/users.module';
import { RefreshTokenModule } from '@/features/shared/tokens/token.module';
import type { AppConfig } from '@/common/interfaces';
import { SecurityModule } from '@/features/shared/security/security.module';

@Module({
  // imports internal and external lib
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
    SecurityModule,
  ],

  // API ENDPOINTS
  controllers: [AuthController],

  providers: [
    services.AuthService,
    services.CredentialsService,
    strategies.LocalStrategy,
    strategies.JwtStrategy,
  ],

  exports: [services.AuthService],
})
export class AuthModule {}
