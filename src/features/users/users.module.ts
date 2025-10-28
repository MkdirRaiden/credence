import { Module } from '@nestjs/common';
import { UsersController } from '@/features/users/users.controller';
import { UsersService } from '@/features/users/users.service';
import { UsersRepository } from '@/features/users/repositories/users.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService], // Export for Auth module to use later
})
export class UsersModule {}
