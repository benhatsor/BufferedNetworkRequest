import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    include: ['tests/**.test.ts'],
    projects: [
      {
        test: {
          name: 'browser',
          browser: {
            provider: playwright(),
            enabled: true,
            headless: true,
            screenshotFailures: false,
            instances: [
              { browser: 'chromium' },
              { browser: 'webkit' },
              { browser: 'firefox' },
            ],
          },
        },
      },
      {
        test: {
          name: 'node',
          environment: 'node',
        },
      },
    ],
  }
})
