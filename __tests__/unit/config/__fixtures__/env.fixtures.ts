// __tests__/unit/config/__fixtures__/env.fixtures.ts
export const validEnv = {
  NODE_ENV: 'test',
  PORT: '5000',
  APP_NAME: 'Credence',
  APP_VERSION: '1.0.0',
  ALLOWED_ORIGINS: 'http://localhost:3000,http://localhost:4200',
  DATABASE_URL:
    'postgresql://test_user:test_password@localhost:5432/credence_test',
  JWT_SECRET: 'aB3xY9mK2pL5qRsT8vW1nO4jU6hG7fD0eC',
  JWT_REFRESH_SECRET: 'pO9wMl1uClWKODvDmSQ69RUcHY9ii2eP1Ld6KWWdes',
};

export const criticalErrorEnv = {
  PORT: '5000',
  APP_NAME: 'Credence',
  APP_VERSION: '1.0.0',
  // Missing critical: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET
};
