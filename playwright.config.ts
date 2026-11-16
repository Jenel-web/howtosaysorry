import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  testMatch: '*.pw.ts',
  outputDir: 'e2e/.results',
  use: { baseURL: 'http://localhost:5173', permissions: ['clipboard-read', 'clipboard-write'] },
  projects: [
    { name: 'mobile', use: { viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: { command: 'npm run dev -- --port 5173', url: 'http://localhost:5173', reuseExistingServer: true },
})
