// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { buildResponse } from '../utils/response-builder.util';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // Optionally add API version header
    response.setHeader('X-API-Version', '1.0.0');

    return next.handle().pipe(
      map((data) => {
        const formattedResponse = buildResponse(data ?? null, request.url, response.statusCode);
        return formattedResponse;
      }),
      tap((formattedResponse) => {
        this.logger.debug(
          `Response sent for ${request.method} ${request.url}: ${JSON.stringify(formattedResponse)}`
        );
      })
    );
  }
}

