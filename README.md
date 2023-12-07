# Poly Tutor - A Language Tutor, 語言導師

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https:///pr.new/jacob-8/poly-tutor)

## Contributing 貢獻

### Get Started Locally

- `pnpm install`
- `pnpm dev`
- Install [Svelte Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- Make changes, run `pnpm test` and `pnpm check` if you made any changes that could have broken things
- Commit your changes and create a pull request - if CI fails, fix the errors and commit again
- Your edits will automatically be linted when you try to commit. If you find your commit fails, check the output, or run `pnpm lint`, fix the lint errors and try to commit again.

### Tips
- Hold `Ctrl+Shift` and click on a component to jump to edit it in the code.
- [Learn Svelte and SvelteKit](https://learn.svelte.dev)
- [Svelte Docs](https://svelte.dev/)
- [SvelteKit Docs](https://kit.svelte.dev/)

## Roadmap

- All tests running in CI
  - Vitest
  - Playwright
  - Component snapshots - copy across key
- Use GPT3.5 to clean up transcripts into sentences
- Add ability to listen to YouTube in chunks with translation
- Save user known words
- Save user seen words
- Store users learning language in metadata so when they log in on a 2nd device, it remembers (low priority because browser default language will most likely predict the language they know well, and thus the language they want to learn)