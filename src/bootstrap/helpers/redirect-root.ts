// src/bootstrap/helpers/redirect-root.ts
import type { Request, Response, NextFunction } from 'express';

export function redirectToRoot(prefix: string) {
  const normalized = `/${String(prefix || '').replace(/^\/+|\/+$/g, '')}`;
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/') {
      return res.redirect(normalized);
    }
    next();
  };
}
