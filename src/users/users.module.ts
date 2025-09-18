// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository], // include repository here
  exports: [UsersService], // export service for other modules (e.g., ReferralsModule)
})
export class UsersModule {}
