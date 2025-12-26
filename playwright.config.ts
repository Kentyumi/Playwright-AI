import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 60000,
  use: {
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
  reporter: [['html', { open: 'never' }]]
});
