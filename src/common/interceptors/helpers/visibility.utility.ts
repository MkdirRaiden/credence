// src/common/interceptors/helpers/visibility.utility.ts
import type {
  FieldSelectorContext,
  VisibilityLevel,
  AuthenticatedUser,
} from '@/common/interfaces';

export function buildVisibilityContext(
  declaredLevel: VisibilityLevel,
  user: AuthenticatedUser | undefined,
  resourceOwnerId?: string,
): FieldSelectorContext {
  const isAdmin = user?.role === 'ADMIN';
  const isOwner = user?.id && resourceOwnerId === user.id;

  switch (true) {
    case isAdmin:
      return { level: 'admin', requesterId: user.id };
    case isOwner:
      return { level: 'self', requesterId: user.id };
    default:
      return { level: 'public', requesterId: user?.id };
  }
}
