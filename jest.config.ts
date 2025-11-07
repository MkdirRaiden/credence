// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest.setup.ts'],
  clearMocks: true,
  forceExit: true,
  testTimeout: 10000,
  maxWorkers: 1,  // Single worker = cleaner cleanup
  coverageThreshold: {
    "global": {
      "branches": 75,
      "functions": 70,
      "lines": 80,
      "statements": 80
    }
  }

};

export default config;
