// Ensure .env files are loaded before tests
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// Silence Prisma warnings or other noisy logs in test output
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
