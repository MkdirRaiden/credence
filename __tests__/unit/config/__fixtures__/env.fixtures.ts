//__tests__/unit/config/__fixtures__
export const validEnv = {
  NODE_ENV: 'development',
  PORT: '4000',
  DATABASE_URL: 'postgresql://localhost:5432/credence',
  APP_NAME: 'Credence',
  APP_VERSION: '1.0.0',
  ALLOWED_ORIGINS: 'http://localhost:3000,https://credence.app',
};

export const invalidEnv = {
  NODE_ENV: 'invalid_env',
  DATABASE_URL: 'not_a_url',
  ALLOWED_ORIGINS: 'not_a_url',
};

export const partialEnv = {
  DATABASE_URL: 'postgresql://localhost:5432/credence',
};
