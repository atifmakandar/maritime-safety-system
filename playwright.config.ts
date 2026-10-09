import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 45000,
  use: { baseURL: 'http://127.0.0.1:5185', viewport: { width: 1440, height: 1000 },
    launchOptions: process.env.BROWSER_EXECUTABLE_PATH ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH } : {}, screenshot: 'only-on-failure' },
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 5185 --strictPort', url: 'http://127.0.0.1:5185', reuseExistingServer: false },
});
