CREATE TABLE profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone not null default now(),
  username text unique,
  avatar_url text,

  welcome_email_sent timestamp with time zone,
  unsubscribed_from_emails timestamp with time zone,

  CONSTRAINT username_length CHECK (CHAR_LENGTH(username) >= 3)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
ON profiles FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own profile." 
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  result INT;
BEGIN
  INSERT INTO public.profiles (id, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'avatar_url');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
