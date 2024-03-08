CREATE POLICY "guests can view public youtube_playlists"
ON youtube_playlists FOR SELECT 
TO anon
USING (public IS NOT NULL);
