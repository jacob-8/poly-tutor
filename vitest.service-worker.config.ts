import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    name: 'tutor:service-worker',
    include: ['src/service-worker.test.ts'],
  },
})
