import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import 'dotenv/config';

// Load .env (not committed). Use .env.example as template.
dotenv.config();

const baseURL = process.env.BASE_URL || 'https://practicesoftwaretesting.com';

export default defineConfig({
  testDir: './tests',
  // Keep default retries low for HW. You can increase for flaky environments.
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // SlowMo helps when running headed, keep off by default.
    actionTimeout: 15_000,
    navigationTimeout: 30_000
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'storageState.json'
      },
      dependencies: ['setup']
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'storageState.json'
      },
      dependencies: ['setup']
    }
  ]
});
