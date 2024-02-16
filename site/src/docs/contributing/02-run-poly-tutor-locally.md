# Run Poly Tutor Locally

## Frontend-only changes in Kitbook
- Run `pnpm-dev`
- Open the `Kitbook` url in your browser instead of the normal `Local` url.
- Press `Ctrl+K` to search for the component you want to edit and jump straight to it. If the Vite server needs to do a re-start to bundle packages then you'll have to do this twice.
- Use the various Kitbook shortcuts to a variants template or jump to the component's code and make edits.

## Fullstack changes
- Start Docker and run `supabase start`
- Run `pnpm dev` and open the site
- Make changes, run `pnpm test`, `pnpm check`, and `pnpm e2e` as necessary according to what you are editing.
- When finished you can run `supabase stop` and close Docker. 
