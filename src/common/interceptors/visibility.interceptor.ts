// src/common/interceptors/visibility.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestWithContext, VisibilityLevel } from '@/common/interfaces';
import { VISIBILITY_KEY } from '@/common/constants';
import { extractResourceId } from '@/common/utils';
import { buildVisibilityContext } from '@/common/interceptors/helpers';

@Injectable()
export class VisibilityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();

    const declaredLevel =
      (Reflect.getMetadata(
        VISIBILITY_KEY,
        context.getHandler(),
      ) as VisibilityLevel) || 'public';

    const resourceOwnerId = extractResourceId(request);

    const selectorContext = buildVisibilityContext(
      declaredLevel,
      request.user,
      resourceOwnerId,
    );

    request['visibility-context'] = selectorContext;
    return next.handle();
  }
}
