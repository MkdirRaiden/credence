import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService], // PrismaService is global, no need to provide
  exports: [UsersService],   // export if other modules need UsersService
})
export class UsersModule {}
