// src/features/users/dtos/pagination-query.dto.ts
import { IsOptional, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PAGINATION_LIMITS } from '@/features/users/constants';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    example: PAGINATION_LIMITS.DEFAULT_SKIP,
    description: 'Number of records to skip (offset)',
    minimum: PAGINATION_LIMITS.DEFAULT_SKIP,
    maximum: PAGINATION_LIMITS.MAX_SKIP,
    default: PAGINATION_LIMITS.DEFAULT_SKIP,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'skip must be an integer' })
  @Min(PAGINATION_LIMITS.DEFAULT_SKIP, {
    message: `skip must be >= ${PAGINATION_LIMITS.DEFAULT_SKIP}`,
  })
  @Max(PAGINATION_LIMITS.MAX_SKIP, {
    message: `skip must be <= ${PAGINATION_LIMITS.MAX_SKIP}`,
  })
  skip: number = PAGINATION_LIMITS.DEFAULT_SKIP;

  @ApiPropertyOptional({
    example: PAGINATION_LIMITS.DEFAULT_TAKE,
    description: 'Number of records to take (page size)',
    minimum: 1,
    maximum: PAGINATION_LIMITS.MAX_TAKE,
    default: PAGINATION_LIMITS.DEFAULT_TAKE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'take must be an integer' })
  @Min(1, { message: 'take must be >= 1' })
  @Max(PAGINATION_LIMITS.MAX_TAKE, {
    message: `take must be <= ${PAGINATION_LIMITS.MAX_TAKE}`,
  })
  take: number = PAGINATION_LIMITS.DEFAULT_TAKE;
}
