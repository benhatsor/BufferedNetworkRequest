import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'browser',
          browser: {
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
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
  },
})
