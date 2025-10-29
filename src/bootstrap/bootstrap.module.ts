//src/bootstrap/bootstrap.module.ts
import { Module } from '@nestjs/common';
import { BootstrapService } from '@/bootstrap/bootstrap.service';

@Module({
  providers: [BootstrapService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
