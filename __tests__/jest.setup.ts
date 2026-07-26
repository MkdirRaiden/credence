import { config } from 'dotenv';

// Load test env
config({ path: 'env/.env.test' });

// Global timeout for all tests
jest.setTimeout(10000);

// Clear all timers after each test
afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

// Force exit after all tests
afterAll(async () => {
  // Give async operations time to settle
  await new Promise((resolve) => setTimeout(resolve, 100));
});
