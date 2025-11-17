// src/health/dtos/dependency-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DependencyStatusDto {
  @ApiProperty({ example: 'up', enum: ['up', 'down'] })
  status: 'up' | 'down';

  @ApiProperty({
    example: 'Database connected',
    required: false,
    description: 'Optional human-readable status message',
  })
  message?: string;
}