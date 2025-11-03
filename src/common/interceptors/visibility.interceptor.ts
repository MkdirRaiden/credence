// src/common/interceptors/visibility.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  RequestWithContext,
  FieldSelectorContext,
  VisibilityLevel,
  AuthenticatedUser,
} from '@/common/interfaces';
import { VISIBILITY_KEY } from '@/common/constants';

/**
 * Attaches field visibility context to request based on endpoint level, user role, and resource ownership.
 * Smart logic: upgrades level if user has higher privilege or owns the resource.
 */
@Injectable()
export class VisibilityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();

    const declaredLevel =
      (Reflect.getMetadata(
        VISIBILITY_KEY,
        context.getHandler(),
      ) as VisibilityLevel) || 'public';

    const user = request.user;
    const requestedUserId = request.params.id;

    const selectorContext = this.buildSelectorContext(
      declaredLevel,
      user,
      requestedUserId,
    );

    request['visibility-context'] = selectorContext;
    return next.handle();
  }

  private buildSelectorContext(
    declaredLevel: VisibilityLevel,
    user: AuthenticatedUser | undefined,
    requestedUserId?: string,
  ): FieldSelectorContext {
    const userId = user?.id;
    const userRole = user?.role;
    const isAdmin = userRole === 'ADMIN';
    const isOwner = userId && requestedUserId === userId;

    switch (true) {
      case isAdmin:
        return { level: 'admin', requesterId: userId };
      case isOwner:
        return { level: 'self', requesterId: userId };
      default:
        return { level: 'public', requesterId: userId };
    }
  }
}
