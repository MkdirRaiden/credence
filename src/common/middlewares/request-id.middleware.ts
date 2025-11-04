// src/common/middlewares/request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { requestContext } from '@/common/utils';

/**
 * Extracts or generates request ID for distributed tracing.
 * Stores in AsyncLocalStorage for access throughout request lifecycle.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) ?? randomUUID();
    requestContext.run({ requestId }, () => next());
  }
}
