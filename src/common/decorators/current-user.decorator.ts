// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserResponseDto } from '@/features/users/dtos';

/**
 * Extracts authenticated user from JWT request.
 * Requires JwtAuthGuard to be applied.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserResponseDto => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: UserResponseDto }>();
    return request.user;
  },
);
