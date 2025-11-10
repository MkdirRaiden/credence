// src/logger/constants

export { LOG_LEVEL, NODE_ENV } from '@/config/constants';

export const SENSITIVE_FIELDS = [
  'password',
  'passwordHash',
  'newPassword',
  'oldPassword',
  'confirmPassword',
  'token',
  'accessToken',
  'refreshToken',
  'idToken',
  'secret',
  'apiKey',
  'apiSecret',
  'authorization',
  'cookie',
  'sessionId',
  'creditCard',
  'cardNumber',
  'cvv',
  'ssn',
  'otp',
  'code',
] as const;
