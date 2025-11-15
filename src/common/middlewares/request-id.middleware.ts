// src/common/middlewares/request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { requestContext } from '@/common/utils';
import { X_REQUEST_ID } from '@/common/constants';

/**
 * Extracts or generates request ID for distributed tracing.
 * Stores in AsyncLocalStorage for access throughout request lifecycle.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = (req.headers[X_REQUEST_ID] as string) ?? randomUUID();

    requestContext.run({ requestId }, () => {
      next();
    });
  }
}
