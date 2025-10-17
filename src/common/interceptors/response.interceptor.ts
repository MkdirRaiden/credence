// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
  import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { buildResponse } from '@/common/utils';
import { LoggerService } from '@/logger/logger.service';

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
  constructor(private readonly logger: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardResponse<T> | T> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Add API version header (could be sourced from config later)
    res.setHeader('X-API-Version', '1.0.0');

    const start = Date.now();

    return next.handle().pipe(
      map((data: T) => {
        // Do not wrap error responses; filters already produced the envelope
        if (res.statusCode >= 400) {
          return data;
        }
        return buildResponse<T>(data, req.url, res.statusCode, true);
      }),
      tap((out) => {
        const duration = Date.now() - start;
        // Compact payload preview to avoid large log lines
        let preview: string;
        try {
          const str = JSON.stringify(out);
          preview = str.length > 500 ? `${str.slice(0, 500)}…[truncated]` : str;
        } catch {
          preview = '[unserializable]';
        }
        this.logger.debug(
          `Response ${req.method} ${req.url} | Status: ${res.statusCode} | Duration: ${duration}ms | Payload: ${preview}`,
          'ResponseInterceptor',
        );
      }),
    );
  }
}
