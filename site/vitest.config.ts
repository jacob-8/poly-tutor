import { defaultExclude, defineProject } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineProject({
  plugins: [svelte()], // for email component rendering
  test: {
    alias: {
      $lib: new URL('./src/lib', import.meta.url).pathname,
      $api: new URL('./src/routes/api', import.meta.url).pathname,
    },
    name: 'unit',
    globals: true,
    setupFiles: ['./src/lib/mocks/msw/vitest-server.ts'],
    includeSource: ['src/**/*.ts'],
    include: ['src/**/*.test.ts'],
    exclude: ['src/service-worker.test.ts', ...defaultExclude],
  },
})
