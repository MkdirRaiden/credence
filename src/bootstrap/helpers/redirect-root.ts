// src/bootstrap/helpers/redirect-root.ts
import type { Request, Response, NextFunction } from 'express';

export function redirectToRoot(prefix: string) {
  const normalized =
    prefix && prefix !== '/'
      ? `/${String(prefix).replace(/^\/+|\/+$/g, '')}`
      : '/';

  return (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/' && normalized !== '/') {
      return res.redirect(normalized);
    }
    next();
  };
}
