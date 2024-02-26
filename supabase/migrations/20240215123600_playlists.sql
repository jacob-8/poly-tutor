CREATE TABLE youtube_playlists (
  id text unique primary key, -- youtube playlist id
  title jsonb[] not null, -- Sentences[]
  "description" jsonb[], -- Sentences[]
  "language" language not null,
  youtubes jsonb[] not null, -- PlaylistYoutubeMetadata[]
  public timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

ALTER TABLE youtube_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view youtube_playlists"
ON youtube_playlists FOR SELECT 
TO authenticated
USING ( true );

CREATE TABLE user_youtube_playlists (
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users ON DELETE CASCADE,
  youtube_playlist_id text NOT NULL REFERENCES youtube_playlists(id),
  added_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, youtube_playlist_id)
);

ALTER TABLE user_youtube_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can add youtube_playlists to their account"
ON user_youtube_playlists FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "users can only see which youtube_playlists they have added"
ON user_youtube_playlists FOR SELECT 
TO authenticated
USING ( auth.uid() = user_id );

CREATE POLICY "users can remove youtube_playlists from their account"
ON user_youtube_playlists FOR DELETE
TO authenticated
USING ( auth.uid() = user_id );
