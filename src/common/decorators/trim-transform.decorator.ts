// src/common/decorators/trim-transform.decorator.ts
import { Transform, TransformFnParams } from 'class-transformer';

/**
 * Trim whitespace from string values
 * Safe transform for class-transformer DTOs
 *
 * @example
 * @TrimTransform
 * name: string;
 */
export const TrimTransform = Transform(({ value }: TransformFnParams): any =>
  typeof value === 'string' ? value.trim() : value,
);
