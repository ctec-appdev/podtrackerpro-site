const { defineConfig } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  reporter: [['list']],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npx http-server dist -p 4173 -c-1',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
