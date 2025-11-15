// src/common/decorators/visibility/visibility.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { VisibilityLevel } from '@/common/interfaces';
import { VISIBILITY_KEY } from '@/common/constants';

/**
 * Decorator to mark endpoint visibility level
 * Used by VisibilityInterceptor to determine FieldSelectorContext
 * async findById(@Param('id') id: string) { }
 */
export const Visibility = (level: VisibilityLevel) =>
  SetMetadata(VISIBILITY_KEY, level);
