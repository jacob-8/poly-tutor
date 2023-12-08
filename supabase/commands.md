# Local Supabase dev

https://supabase.com/docs/guides/cli

## Development

- `pnpx supabase start`
- `pnpx supabase stop`
- `pnpx supabase migration new adding-foo`
- `pnpx supabase db reset`

## Types

- `pnpx supabase gen types typescript --local --schema public > site/src/lib/supabase/types.ts`
- `pnpx supabase gen types typescript --project-id=zfxvyodqwvigxarorgjx --schema public > packages/site/src/lib/supabase/types.ts`

## Push changes to cloud project

- `pnpx supabase login`
- `pnpx supabase link --project-ref=zfxvyodqwvigxarorgjx --password=<DB password>`
- `pnpx supabase db push`

## Misc

- `pnpx supabase status`
