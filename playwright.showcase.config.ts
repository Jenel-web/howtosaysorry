import { defineConfig } from '@playwright/test'

// Generates the launch images in showcase/out. Run: npm run showcase
export default defineConfig({
  testDir: 'showcase',
  testMatch: '*.pw.ts',
  outputDir: 'showcase/.results',
  workers: 1,
  timeout: 120_000,
  use: { baseURL: 'http://localhost:5173' },
  webServer: { command: 'npm run dev -- --port 5173', url: 'http://localhost:5173', reuseExistingServer: true },
})
