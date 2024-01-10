# Local Supabase dev

I recommend you read https://supabase.com/docs/guides/cli and install supabase cli locally, but if you have not installed it you can also prepend `pnpx ` to the commands below.

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
