// __tests__/unit/config/__fixtures__/env.fixtures.ts
export const validEnv = {
  NODE_ENV: 'development',
  PORT: '4000',
  DATABASE_URL: 'postgresql://localhost:5432/credence',
  APP_NAME: 'Credence',
  APP_VERSION: '1.0.0',
  ALLOWED_ORIGINS: 'http://localhost:3000,https://credence.app',
  JWT_SECRET: 'super-secret-jwt-key-for-testing-only',
  JWT_REFRESH_SECRET: 'super-secret-refresh-key-for-testing-only',
};

export const invalidEnv = {
  NODE_ENV: 'invalid_env',
  DATABASE_URL: 'not_a_url',
  ALLOWED_ORIGINS: 'not_a_url',
  JWT_SECRET: '',
  JWT_REFRESH_SECRET: '',
};

export const partialEnv = {
  DATABASE_URL: 'postgresql://localhost:5432/credence',
  JWT_SECRET: 'secret',
  JWT_REFRESH_SECRET: 'refresh-secret',
};
