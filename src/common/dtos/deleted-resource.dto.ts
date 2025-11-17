// src/common/dtos/deleted-resource.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class DeletedResourceDto {
  @ApiProperty({
    example: '8f14e45f-ea3b-4a14-9c4f-123456789abc',
    description: 'ID of the soft-deleted resource',
  })
  id: string;

  @ApiProperty({
    example: '2025-11-18T01:23:45.000Z',
    description: 'Timestamp when the resource was soft-deleted',
  })
  deletedAt: Date;
}
