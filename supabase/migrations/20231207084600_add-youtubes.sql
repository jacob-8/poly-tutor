CREATE TABLE youtube_channels (
  id text unique primary key, -- youtube channel_id
  title text not null,
  "description" text null,
  thumbnail_id text not null,
  updated_at timestamp with time zone not null default now()
);

ALTER TABLE youtube_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can view youtube channels"
ON youtube_channels FOR SELECT 
USING ( true );

CREATE TYPE language as ENUM('en', 'zh');

CREATE TABLE youtubes (
  id text unique primary key, -- youtube video_id
  title text not null,
  "description" text null,
  duration_seconds real null,
  "language" language not null,
  channel_id text references youtube_channels(id) not null,
  created_at timestamp with time zone not null default now()
);

ALTER TABLE youtubes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can view youtubes"
ON youtubes FOR SELECT 
USING ( true );

CREATE TABLE user_youtubes (
  user_id uuid REFERENCES auth.users NOT NULL DEFAULT auth.uid(),
  youtube_id text NOT NULL REFERENCES youtubes(id),
  added_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, youtube_id)
);

ALTER TABLE user_youtubes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can add youtubes to their account"
ON user_youtubes FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "users can only see their added youtubes"
ON user_youtubes FOR SELECT 
TO authenticated
USING ( auth.uid() = user_id );

CREATE POLICY "Users can remove youtubes from their account"
ON user_youtubes FOR DELETE
TO authenticated
USING ( auth.uid() = user_id );
