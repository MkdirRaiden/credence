// src/features/users/users.module.ts
import { Module } from '@nestjs/common';
import * as controllers from '@/features/users/controllers';
import * as repositories from '@/features/users/repositories';
import * as services from '@/features/users/services';
import * as contracts from '@/features/users/contracts';
import { SecurityModule } from '@/features/shared/security/security.module';

/**
 * Users module: user management, visibility, and auth integration.
 * Exports contracts for Auth module to use.
 */
@Module({
  imports: [SecurityModule],

  controllers: [
    controllers.UsersLookupController,
    controllers.UsersCrudController,
  ],

  providers: [
    services.UsersAuthService,
    services.UsersCrudService,
    services.UsersLookupService,
    repositories.UsersAuthRepository,
    repositories.UsersCrudRepository,
    repositories.UsersLookupRepository,
    {
      provide: contracts.BaseAuthService,
      useClass: services.UsersAuthService,
    },
    {
      provide: contracts.BaseCrudService,
      useClass: services.UsersCrudService,
    },
    {
      provide: contracts.BaseLookupService,
      useClass: services.UsersLookupService,
    },
  ],
  
  exports: [
    contracts.BaseAuthService,
    contracts.BaseCrudService,
    contracts.BaseLookupService,
  ],
})
export class UsersModule {}
