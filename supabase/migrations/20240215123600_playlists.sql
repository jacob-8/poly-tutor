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
  last_visit timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, youtube_playlist_id)
);

ALTER TABLE user_youtube_playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can create, view, edit, and delete their youtube_playlists listings" 
ON user_youtube_playlists
AS PERMISSIVE FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- As we just added the last_visit field to the playlists, we can also update the user_youtubes with the same field

ALTER TABLE user_youtubes
ADD last_visit timestamp with time zone NOT NULL DEFAULT now();

CREATE POLICY "users can update their added youtubes"
ON user_youtubes FOR UPDATE
TO authenticated
USING ( auth.uid() = user_id );
