// src/common/dtos/deleted-resource.dto.ts
/**
 * Generic DTO confirming soft-deleted resource with deletion timestamp.
 */
export class DeletedResourceDto {
  id: string;
  deletedAt: Date;
}
