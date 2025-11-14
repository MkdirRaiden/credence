import { UserResponseDto } from '@/common/dtos';
import { FieldSelectorContext } from '@/common/interfaces';

/**
 * Contract for user lookup operations (read-only queries)
 * Implemented by: UserLookupService
 */
export abstract class BaseLookupService {
  /**
   * Find user by ID with visibility filtering
   */
  abstract findById(
    id: string,
    context: FieldSelectorContext,
  ): Promise<Partial<UserResponseDto>>;
}
