// To run automatically on commit, add `simple-git-hooks` and `lint-staged` then run `npx simple-git-hooks` once. After that all commits will be linted.

// @ts-check
import { defineFlatConfig } from 'eslint-define-config'
import jsEslintPlugin from '@eslint/js'
import { typescript } from './lint/typescript.js'
import { svelte } from './lint/svelte.js'

const ignore = {
  ignores: [
    '**/node_modules/**',
    '**/dist/**',
    '.git/**',
    '**/.svelte-kit**',
    'packages/prepare-docs-for-search/docs/**',
  ]
}

const universal = {
  rules: {
    ...jsEslintPlugin.configs.recommended.rules,
    'indent': ['error', 2],
    'no-undef': 'off',
  },
}

// @ts-ignore
export default defineFlatConfig([
  ignore,
  universal,
  typescript,
  svelte,
])
