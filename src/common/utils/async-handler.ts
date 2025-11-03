// src/common/utils/async-handler.ts
/**
 * Wraps async operations with automatic error handling and context preservation.
 */
export async function asyncHandler<T>(
  operation: () => Promise<T>,
  options: {
    context: string;
    errorFactory?: (err: Error) => Error;
  },
): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    
    if (options.errorFactory) {
      throw options.errorFactory(error);
    }
    
    // Attach context to error for handleBootstrapError
    (error as any).context = {
      operation: options.context,
      originalMessage: error.message,
      stack: error.stack,
    };
    
    throw error;
  }
}
