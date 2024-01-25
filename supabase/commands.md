# Local Supabase dev

## CLI Options
1. [Install supabase cli locally](https://supabase.com/docs/guides/cli).
2. Or just prepend `pnpx ` to the commands below. *After awhile you will tire of waiting each command and will do option 1*.

## Development

- `supabase start`
- `supabase stop`
- `supabase migration new adding-foo`
- `supabase db reset`

## Types

- `supabase gen types typescript --local --schema public > site/src/lib/supabase/generated.types.ts`
- `supabase gen types typescript --project-id=tjxlervwzlcvaibrrime --schema public > packages/site/src/lib/supabase/generated.types.ts`

## Push changes to cloud project

- `supabase login`
- `supabase link --project-ref=tjxlervwzlcvaibrrime --password=<DB password>`
- `supabase db push`

## Misc

- `supabase status`
