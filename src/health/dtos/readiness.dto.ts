// src/health/dtos/readiness.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { DependencyStatusDto } from './dependency-status.dto';

export class ReadinessDto {
  @ApiProperty({ example: 'ok', enum: ['ok', 'error'] })
  status: 'ok' | 'error';

  @ApiProperty({
    type: () => Object,
    description: 'Per-dependency readiness status',
  })
  details: Record<string, DependencyStatusDto>;
}