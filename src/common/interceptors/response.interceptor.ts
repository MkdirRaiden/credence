// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { buildResponse } from '@/common/utils';
import { APP_VERSION } from '@/config/constants';
import { StandardResponse } from '@/common/interfaces';

/**
 * Wraps successful responses in StandardResponse envelope with API version.
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T> | T>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardResponse<T> | T> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    res.setHeader('X-API-Version', APP_VERSION);

    return next.handle().pipe(
      map((data: T) => {
        // Skip wrapping for error responses (exception filters handle those)
        if (res.statusCode >= 400) {
          return data;
        }
        return buildResponse<T>(data, req.url, res.statusCode);
      }),
    );
  }
}
