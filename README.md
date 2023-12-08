# Poly Tutor - A Language Tutor, 語言導師

[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https:///pr.new/jacob-8/poly-tutor)

## Contributing 貢獻

### Making Cosmetic Adjustments

This includes small changes like updating translation strings.

- Install [Svelte Extension for VSCode](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- `pnpm install`
- Delete `.env.development` and run `pnpm dev`
- Commit your changes and create a pull request - if CI fails, fix the errors and commit again.
- Your edits will automatically be linted when you try to commit. If you find your commit fails, check the output, or run `pnpm lint`, fix the lint errors and try to commit again.

### Adjusting/Adding Features

If you want to change the way the app works, or add a new feature, also do these steps:

- Install Docker
- Install Supabase CLI
- Run `pnpx supabase start`, and place the appropriate values in the `.env.development` file (instead of deleting it).
- Make changes, run `pnpm test`, `pnpm check`, and `pnpm e2e` if you made any changes that could have broken things. You can also just wait until your pull request runs these commands on push, but that's kind of slow.
- When finished you can run `pnpx supabase stop` and close Docker. 

### Editing the Database Schema
- Create a new migration file: `pnpx supabase migration new adding-foo` (choose a descriptive name)
- Run `pnpx supabase db reset` to reset the database. It will clear all data, run all migrations, and then apply the seed data.
- To generate types from your local database instance run `pnpx supabase gen types typescript --local --schema public > site/src/lib/supabase/types.ts`

### Tips
- Hold `Ctrl+Shift` and click on a component to jump to edit it in the code.
- [Learn Svelte and SvelteKit](https://learn.svelte.dev)
- [Svelte Docs](https://svelte.dev/)
- [SvelteKit Docs](https://kit.svelte.dev/)

## Roadmap

- Save transcripts to Supabase
- Use GPT3.5 to clean up transcripts into sentences
- Add ability to listen to YouTube in chunks with translation
- Save user known words
- Save user seen words
- Store users learning language in metadata so when they log in on a 2nd device, it remembers (low priority because browser default language will most likely predict the language they know well, and thus the language they want to learn)