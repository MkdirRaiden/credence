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

@Injectable()
export class VisibilityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();

    // Cast metadata to VisibilityLevel with default 'public'
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

    switch (declaredLevel) {
      case 'public':
        if (userId && requestedUserId === userId) {
          return { level: 'self', requesterId: userId };
        }
        return { level: 'public', requesterId: userId };

      case 'self':
        if (userId && requestedUserId === userId) {
          return { level: 'self', requesterId: userId };
        }
        return { level: 'public', requesterId: userId };

      case 'admin':
        if (userRole === 'ADMIN') {
          return { level: 'admin', requesterId: userId };
        }
        return { level: 'public', requesterId: userId };

      default:
        return { level: 'public', requesterId: userId };
    }
  }
}
