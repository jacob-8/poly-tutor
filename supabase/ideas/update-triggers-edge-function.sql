-- TODO: set on cloud project instance
-- select vault.create_secret(
--   'tjsnduoporqqlrbbpola',
--   'project_id'
-- );

create function supabase_url()
returns text
language plpgsql
security definer
as $$
declare
  project_id text;
begin
  SELECT
		decrypted_secret
	FROM
		vault.decrypted_secrets
	WHERE
		name = 'project_id'
	LIMIT 1 INTO project_id;

  IF project_id IS NULL THEN
		return 'http://api.supabase.internal:8000';
	ELSE
		return 'https://' || project_id || '.supabase.co';
	END IF;
end;
$$;

create table test_updates (
  id uuid primary key default uuid_generate_v4(),
  created_by uuid references auth.users not null default auth.uid(),
  updated_at timestamp with time zone not null default now(),
  content text
);

create function public.send_email_on_test()
returns trigger as $$
begin
  perform
    net.http_post(
      url := supabase_url() || '/functions/v1/welcome-new-users',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', current_setting('request.headers')::json->>'authorization'
      ),
      body := jsonb_build_object(
        'user_id', new.created_by
      )
    );
  return new;
end;
$$ language plpgsql;

create trigger send_email_on_test
after insert on test_updates
for each row 
execute procedure public.send_email_on_test();


-- create schema private;

-- create function private.send_welcome_email()
-- returns trigger
-- language plpgsql
-- as $$
-- declare
--   result int;
-- begin
  
  -- select
  --   net.http_post(
  --     url := supabase_url() || '/functions/v1/welcome-new-users',
  --     headers := jsonb_build_object(
  --       'Content-Type', 'application/json',
  --       'Authorization', current_setting('request.headers')::json->>'authorization'
  --     ),
  --     body := jsonb_build_object(
  --       'user_id', new.id
  --     )
  --   )
  -- into result;

--   return null;
-- end;
-- $$;

-- create trigger welcome_new_users
-- after insert on auth.users
-- for each row execute procedure private.send_welcome_email();


-- create trigger welcome_new_users 
-- after insert on profiles 
-- for each row
-- execute function "supabase_functions"."http_request"(
--   'http://127.0.0.1:54321/functions/v1/welcome-new-users',
--   'POST',
--   '{"Content-Type":"application/json"}',
--   '{}', -- params
--   '1000' -- timeout
-- );