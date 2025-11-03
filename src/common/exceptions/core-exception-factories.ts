// src/common/exceptions/core-exception-factories.ts
import {
  DatabaseConnectionException,
} from '@/common/exceptions/core.exception';
import { DATABASE_MAX_RETRIES } from '@/common/constants';

/**
 * Factory functions for core exceptions (curried for asyncHandler).
 */
export const CoreExceptionFactories = {
  databaseConnection: (err: Error) =>
    new DatabaseConnectionException(DATABASE_MAX_RETRIES, DATABASE_MAX_RETRIES, err),
};
