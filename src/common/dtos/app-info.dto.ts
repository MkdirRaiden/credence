// src/common/dtos/app-info.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AppInfoDto {
  @ApiProperty({ example: 'Credence', description: 'Application name' })
  name: string;

  @ApiProperty({ example: '0.0.1', description: 'Application version' })
  version: string;

  @ApiProperty({
    example: 'development',
    description: 'Deployment environment',
  })
  environment: string;

  @ApiProperty({
    example: 'http://localhost:5000/docs',
    description: 'URL of the API documentation (Swagger UI)',
  })
  apiDocs: string;
}
