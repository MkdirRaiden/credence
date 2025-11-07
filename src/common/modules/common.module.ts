// src/common/modules/common.module.ts
import { Module, Global } from '@nestjs/common';
import { GLOBAL_INTERCEPTORS, GLOBAL_FILTERS } from '@/common/modules/common.config';

/**
 * Global module providing exception handling and response formatting.
 */
@Global()
@Module({
  providers: [...GLOBAL_INTERCEPTORS, ...GLOBAL_FILTERS],
})
export class CommonModule {}
