CREATE TABLE playlists (
  id uuid primary key default uuid_generate_v4(),
  "public" timestamp with time zone null,
  "name" text not null,
  created_by uuid references auth.users not null default auth.uid(),
  created_at timestamp with time zone not null default now()
);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can create playlists"
ON playlists FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = created_by );

-- TODO: use FOR ALL and remove lower delete policy to allow users to update their playlist public value

CREATE POLICY "users can only see their playlists or public playlists"
ON playlists FOR SELECT 
TO authenticated
USING ( "public" IS NOT NULL OR auth.uid() = created_by );

CREATE POLICY "Users can delete their playlists"
ON playlists FOR DELETE
TO authenticated
USING ( auth.uid() = created_by );

CREATE TABLE playlists_youtubes (
  playlist_id uuid not null references playlists(id),
  youtube_id text not null references youtubes(id),
  primary key (playlist_id, youtube_id)
);

ALTER TABLE playlists_youtubes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can add a youtube to their playlist"
ON playlists_youtubes FOR INSERT
TO authenticated
WITH CHECK ( auth.uid() = (SELECT created_by FROM playlists WHERE id = playlist_id) );

CREATE POLICY "users can see which youtubes are in playlists they have access to"
ON playlists_youtubes FOR SELECT 
TO authenticated
USING ( auth.uid() = (SELECT created_by FROM playlists WHERE id = playlist_id) OR (SELECT "public" FROM playlists WHERE id = playlist_id) IS NOT NULL );

CREATE POLICY "Users can remove a youtube from their playlist"
ON playlists_youtubes FOR DELETE
TO authenticated
USING ( auth.uid() = (SELECT created_by FROM playlists WHERE id = playlist_id) );
