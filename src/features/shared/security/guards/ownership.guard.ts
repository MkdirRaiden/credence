// src/features/shared/security/guards/ownership.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserResponseDto } from '@/common/dtos';
import { UserAccessForbiddenException } from '@/common/exceptions';
import { UserRole } from '@prisma/client';
import { ROLES } from '@/common/constants';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Allow if @Roles(ADMIN) is explicitly set (admin bypasses ownership)
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (requiredRoles?.includes(UserRole.ADMIN)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const resourceUserId = request.params.id;
    const currentUser = request.user as UserResponseDto;

    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }

    const isOwner = currentUser.id === resourceUserId;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new UserAccessForbiddenException();
    }

    return true;
  }
}
