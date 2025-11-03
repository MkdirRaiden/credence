// src/features/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from '@/features/users/users.controller';
import { UsersService } from '@/features/users/users.service';
import { UsersRepository } from '@/features/users/users.repository';
import { BaseUserService } from '@/features/users/base-user.service';

/**
 * Users module: user management, visibility, and auth integration.
 * Exports BaseUserService for Auth module to use.
 */
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    {
      provide: BaseUserService,
      useClass: UsersService,
    },
  ],
  exports: [BaseUserService],
})
export class UsersModule {}
