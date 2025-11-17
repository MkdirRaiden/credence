// src/health/dtos/liveness.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LivenessDto {
  @ApiProperty({ example: 'up', description: 'Overall service status' })
  status: 'up';

  @ApiProperty({
    example: 12345,
    description: 'Process uptime in milliseconds',
  })
  uptimeMs: number;
}
