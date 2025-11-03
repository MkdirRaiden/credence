// src/common/interfaces/user-config.interface.ts
import { Request } from 'express';

export type VisibilityLevel = 'public' | 'self' | 'admin';

export interface FieldSelectorContext {
  level: VisibilityLevel;
  requesterId?: string;
  skip?: number;
  take?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface RequestWithContext extends Request {
  user?: AuthenticatedUser;
  'visibility-context': FieldSelectorContext;
}

export interface FieldVisibility {
  [key: string]: VisibilityLevel[];
}
