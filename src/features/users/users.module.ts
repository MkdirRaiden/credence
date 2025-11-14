// src/features/users/users.module.ts
import { Module } from '@nestjs/common';
import * as controllers from '@/features/users/controllers';
import * as repositories from '@/features/users/repositories';
import * as services from '@/features/users/services';
import * as contracts from '@/features/users/contracts';

/**
 * Users module: user management, visibility, and auth integration.
 * Exports contracts for Auth module to use.
 */
@Module({
  controllers: [
    controllers.UsersLookupController,
    controllers.UsersCrudController,
  ],
  providers: [
    services.UserAuthService,
    services.UserCrudService,
    services.UserLookupService,
    repositories.UsersAuthRepository,
    repositories.UsersCrudRepository,
    repositories.UsersLookupRepository,
    {
      provide: contracts.BaseAuthService,
      useClass: services.UserAuthService,
    },
    {
      provide: contracts.BaseCrudService,
      useClass: services.UserCrudService,
    },
    {
      provide: contracts.BaseLookupService,
      useClass: services.UserLookupService
    }
  ],
  exports: [
    contracts.BaseAuthService, 
    contracts.BaseCrudService, 
    contracts.BaseLookupService
  ],
})
export class UsersModule {}
