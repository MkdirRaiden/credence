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
import { buildResponse } from '@/common/utils/response-builder.util';
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
  implements NestInterceptor<T, StandardResponse<T>>
{
  constructor(private readonly logger: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<StandardResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Add API version header (could be dynamic from config)
    response.setHeader('X-API-Version', '1.0.0');

    const startTime = Date.now();

    return next.handle().pipe(
      map((data: T) => buildResponse(data, request.url, response.statusCode)),
      tap((formattedResponse: StandardResponse<T>) => {
        const duration = Date.now() - startTime;
        this.logger.debug(
          `Response ${request.method} ${request.url} | Status: ${response.statusCode} | Duration: ${duration}ms | Payload: ${JSON.stringify(
            formattedResponse,
          )}`,
          'ResponseInterceptor',
        );
      }),
    );
  }
}
