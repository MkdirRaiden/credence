// src/features/auth/guards/local-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This guard triggers the LocalStrategy.
 * When applied to a route, it will:
 * 1. Extract email and password from the request body
 * 2. Call LocalStrategy's validate() method
 * 3. Attach the validated user to req.user
 * 4. Allow the request to proceed if successful
 * 5. Throw 401 Unauthorized if validation fails
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
