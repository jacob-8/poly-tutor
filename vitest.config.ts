import { defaultExclude, defineProject } from 'vitest/config'
// import { resolve } from 'node:path'
// import { fileURLToPath } from 'node:url'
// const projectDir = fileURLToPath(new URL('.', import.meta.url))

export default defineProject({
  test: {
    alias: {
      // $lib: resolve(projectDir, './src/lib'),
      $lib: new URL('./src/lib', import.meta.url).pathname,
    },
    name: 'unit',
    globals: true,
    includeSource: ['src/**/*.ts'],
    include: ['src/**/*.test.ts'],
    exclude: ['src/service-worker.test.ts', ...defaultExclude],
  },
})
