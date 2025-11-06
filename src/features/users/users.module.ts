// src/features/users/users.module.ts
import { Module } from '@nestjs/common';
import {
  UsersLookupController,
  UsersCrudController,
} from '@/features/users/controllers';
import {
  UsersAuthRepository,
  UsersLookupRepository,
  UsersCrudRepository,
} from '@/features/users/repositories';
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
  controllers: [UsersLookupController, UsersCrudController],
  providers: [
    UserAuthService,
    UserCrudService,
    UserLookupService,
    UsersAuthRepository,
    UsersCrudRepository,
    UsersLookupRepository,
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
