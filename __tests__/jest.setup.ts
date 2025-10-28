// __tests__/jest.setup.ts
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// Global test timeout
jest.setTimeout(20000);
