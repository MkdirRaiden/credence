// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

/**
 * Set required roles for endpoint
 * @param roles - Required user role(s)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
