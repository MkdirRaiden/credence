// src/common/decorators/trim-transform.decorator.ts
import { Transform, TransformFnParams } from 'class-transformer';

/**
 * Trims whitespace from string values in class-transformer DTOs.
 */
export const TrimTransform = Transform(({ value }: TransformFnParams): any =>
  typeof value === 'string' ? value.trim() : value,
);
