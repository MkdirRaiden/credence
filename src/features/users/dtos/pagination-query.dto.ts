// src/features/users/dtos/pagination-query.dto.ts
import { IsOptional, Min, Max, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION_LIMITS } from '@/features/users/constants';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION_LIMITS.DEFAULT_SKIP, {
    message: `skip must be >= ${PAGINATION_LIMITS.DEFAULT_SKIP}`,
  })
  @Max(PAGINATION_LIMITS.MAX_SKIP, {
    message: `skip must be <= ${PAGINATION_LIMITS.MAX_SKIP}`,
  })
  skip?: number = PAGINATION_LIMITS.DEFAULT_SKIP;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'take must be >= 1' })
  @Max(PAGINATION_LIMITS.MAX_TAKE, {
    message: `take must be <= ${PAGINATION_LIMITS.MAX_TAKE}`,
  })
  take?: number = PAGINATION_LIMITS.DEFAULT_TAKE;
}
