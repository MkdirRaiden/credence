// src/common/interfaces/user-config.interface.ts
import { Request } from 'express';

// Define visibility levels for user fields
export type VisibilityLevel = 'public' | 'self' | 'admin';

// Context for field selection based on visibility
export interface FieldSelectorContext {
  level: VisibilityLevel;
  requesterId?: string;
  skip?: number;
  take?: number;
}

// Authenticated user information
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// Extended request interface to include user and visibility context
export interface RequestWithContext extends Request {
  user?: AuthenticatedUser;
  'visibility-context': FieldSelectorContext;
}

// Interface for defining field visibility settings
export interface FieldVisibility {
  [key: string]: VisibilityLevel[];
}
