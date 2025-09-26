// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { buildResponse } from '../utils/response-builder';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        const formattedResponse = buildResponse(data, request.url, response.statusCode);
        return formattedResponse;
      }),
      tap((formattedResponse) => {
        // Log the response with status code and endpoint
        this.logger.debug(
          `Response sent for ${request.method} ${request.url}: ${JSON.stringify(formattedResponse)}`
        );
      })
    );
  }
}
