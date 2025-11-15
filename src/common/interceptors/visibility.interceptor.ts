// src/common/interceptors/visibility.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestWithContext, VisibilityLevel } from '@/common/interfaces';
import * as constants from '@/common/constants';
import { extractResourceId } from '@/common/utils';
import { buildVisibilityContext } from '@/common/interceptors/helpers';

@Injectable()
export class VisibilityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithContext>();

    const declaredLevel =
      (Reflect.getMetadata(
        constants.VISIBILITY_KEY,
        context.getHandler(),
      ) as VisibilityLevel) || constants.VISIBILITY_LEVEL;

    const resourceOwnerId = extractResourceId(request);

    const selectorContext = buildVisibilityContext(
      declaredLevel,
      request.user,
      resourceOwnerId,
    );

    request[constants.VISIBILITY_CONTEXT] = selectorContext;
    return next.handle();
  }
}
