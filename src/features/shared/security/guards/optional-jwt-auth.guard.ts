// src/feature/shared/security/guards/optional-jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Optional JWT authentication
 * Attaches user if token provided, allows request even if missing
 * Used for routes that work public but benefit from auth context
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any): any {
    // Return user if authenticated, otherwise return null (don't throw error)
    return user || null;
  }
}
