import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Tell Jest where to look for tests
  roots: ['<rootDir>/__tests__', '<rootDir>/src'],

  // Match .spec.ts files
  testRegex: '.*\\.spec\\.ts$',

  // Map TypeScript path aliases for Jest
    moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',   // optional if using @
    '^src/(.*)$': '<rootDir>/src/$1', // required for existing imports like src/common/constants
    },

  // Ignore these folders
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Coverage config
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: '<rootDir>/coverage',

  // Automatically clear mocks between tests
  clearMocks: true,

  // No setup files yet
  setupFiles: [],
};

export default config;
