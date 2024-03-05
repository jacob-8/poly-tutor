create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone not null default now(),
  username text unique,
  avatar_url text,

  welcome_email_sent timestamp with time zone,
  unsubscribed_from_emails timestamp with time zone,

  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

create function handle_new_user()
returns trigger as $$
declare
  result int;
begin
  insert into public.profiles (id, avatar_url)
  values (new.id, new.raw_user_meta_data->>'avatar_url');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();
