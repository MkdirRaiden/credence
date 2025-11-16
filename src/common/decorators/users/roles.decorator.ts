// src/common/decorators/users/roles.decorator.ts
import { ROLES } from '@/common/constants';
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES, roles);
