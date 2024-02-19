# Supabase Commands

## Development

- `supabase start` to start a local instance of supabase, including POSTGres, Storage, Email, Functions, etc...
- `supabase migration new <feature-name>` to write a new sql migration that will edit the database. Changes are saved in version control under supabase/migrations.
- `supabase gen types typescript --local --schema public > packages/site/src/lib/supabase/generated.types.ts` to update type definitions if you updated the Schema.
- `supabase db reset` to return to a new PostGRES database w/o tables or data, run each migration sequentially and then run finally the `supabase/seed.sql` file.
- `supabase stop` to close down the Docker containers. State will be saved and restored the next time you run `supabase start`

Once you have run `supabase start` you can open the Studio URL to explore your local Supabase project. The studio is a convenient way to inspect data and make changes via a UI, but after making changes use the UI to see the underlying SQL changes and then create a new migration with the SQL. Then run `supabase db reset` to make sure your migration works as expected.

## Push changes to cloud project

Only site admin does this:

- `supabase login`
- `supabase link --project-ref=tjsnduoporqqlrbbpola --password=<DB password>`
- `supabase db push`

## Misc

- `pnpm reset-db` generates fresh seed SQL from the JavaScript data in `site/src/lib/mocks/seed`, erases DB data, applies fresh seed and also writes the seed to `supabase/seed.sql` so that it will be used in future `supabase db reset` commands.
- `supabase status` check status and get local urls
- `supabase gen types typescript --project-id=tjsnduoporqqlrbbpola --schema public > packages/site/src/lib/supabase/generated.types.ts` to generate types from online project - we never need this because we always develop locally and then push changes up.
