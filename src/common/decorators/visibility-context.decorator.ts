// src/common/decorators/visibility-context.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithContext, FieldSelectorContext } from '@/common/interfaces';

export const GetVisibilityContext = createParamDecorator(
  (data: unknown, context: ExecutionContext): FieldSelectorContext => {
    const request = context.switchToHttp().getRequest<RequestWithContext>();
    return request['visibility-context'];
  },
);
