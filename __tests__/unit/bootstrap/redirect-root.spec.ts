// __tests__/unit/bootstrap/redirect-root.spec.ts
import { redirectToRoot } from '@/bootstrap/helpers/redirect-root';

describe('redirectToRoot', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { path: '/' };
    res = { redirect: jest.fn() };
    next = jest.fn();
  });

  it('✅ redirects to normalized prefix if path is root', () => {
    const middleware = redirectToRoot('api');
    middleware(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith('/api');
    expect(next).not.toHaveBeenCalled();
  });

  it('✅ calls next() if path is not root', () => {
    req.path = '/other';
    const middleware = redirectToRoot('api');
    middleware(req, res, next);

    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('✅ handles empty prefix correctly', () => {
    const middleware = redirectToRoot('');
    middleware(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith('/');
  });

  it('✅ trims leading/trailing slashes in prefix', () => {
    const middleware = redirectToRoot('/v1/');
    middleware(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith('/v1');
  });
});
