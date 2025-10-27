// src/common/common.module.ts
import { Module, Global } from '@nestjs/common';
import { GLOBAL_INTERCEPTORS, GLOBAL_FILTERS } from '@/common/common.config';

@Global()
@Module({
  providers: [
    ...GLOBAL_INTERCEPTORS,
    ...GLOBAL_FILTERS,
  ]
})
export class CommonModule {}