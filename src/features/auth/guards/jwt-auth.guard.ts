// src/features/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This guard triggers the JwtStrategy.
 * When applied to a route, it will:
 * 1. Extract the JWT from the Authorization header (Bearer token)
 * 2. Call JwtStrategy's validate() method
 * 3. Verify the token signature and expiration
 * 4. Attach the decoded user payload to req.user
 * 5. Allow the request to proceed if token is valid
 * 6. Throw 401 Unauthorized if token is invalid or expired
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
