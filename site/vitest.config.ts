import { defaultExclude, defineProject } from 'vitest/config'

export default defineProject({
  test: {
    alias: {
      $lib: new URL('./src/lib', import.meta.url).pathname,
    },
    name: 'unit',
    globals: true,
    setupFiles: ['./src/lib/mocks/msw/vitest-server.ts'],
    includeSource: ['src/**/*.ts'],
    include: ['src/**/*.test.ts'],
    exclude: ['src/service-worker.test.ts', ...defaultExclude],
  },
})
