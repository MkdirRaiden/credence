// src/features/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from '@/features/users/users.controller';
import { UsersRepository } from '@/features/users/repositories/users.repository';
import {
  UserAuthService,
  UserCrudService,
  UserLookupService,
} from '@/features/users/services';
import { BaseAuthService, BaseCrudService } from '@/features/users/contracts';

/**
 * Users module: user management, visibility, and auth integration.
 * Exports contracts for Auth module to use.
 */
@Module({
  controllers: [UsersController],
  providers: [
    UserAuthService,
    UserCrudService,
    UserLookupService,
    UsersRepository,
    {
      provide: BaseAuthService,
      useClass: UserAuthService,
    },
    {
      provide: BaseCrudService,
      useClass: UserCrudService,
    },
  ],
  exports: [BaseAuthService, BaseCrudService],
})
export class UsersModule {}
