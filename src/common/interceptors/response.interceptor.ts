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
import { APP_VERSION } from '../constants';

export interface StandardResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}

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
        // Don't wrap error responses - filters handle those
        if (res.statusCode >= 400) {
          return data;
        }
        return buildResponse<T>(data, req.url, res.statusCode, true);
      }),
    );
  }
}
