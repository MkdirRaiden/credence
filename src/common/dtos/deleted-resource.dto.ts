// src/common/dtos/deleted-resource.dto.ts
/**
 * Generic DTO for soft-deleted resources
 * Used across all modules (users, posts, comments, etc.)
 * Confirms deletion with minimal metadata
 */
export class DeletedResourceDto {
  /**
   * ID of the deleted resource
   */
  id: string;

  /**
   * Timestamp when resource was marked as deleted
   * Useful for auditing, recovery, and client-side UI (e.g., "Deleted on ...")
   */
  deletedAt: Date;
}
