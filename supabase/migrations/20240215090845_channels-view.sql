ALTER TABLE user_youtubes
ADD last_visit timestamp with time zone NOT NULL DEFAULT now();

CREATE POLICY "users can update their added youtubes"
ON user_youtubes FOR UPDATE
TO authenticated
USING ( auth.uid() = user_id );

CREATE VIEW user_youtube_channels AS
SELECT DISTINCT ON (youtube_channels.id)
  youtube_channels.id,
  youtube_channels.title,
  youtube_channels.description,
  youtube_channels.thumbnail_url,
  youtube_channels.subscriber_count,
  youtube_channels.video_count,
  youtube_channels.view_count,
  youtube_channels.updated_at,
  youtubes.language,
  recent_visits.last_visit
FROM youtube_channels
INNER JOIN youtubes on youtube_channels.id = youtubes.channel_id
INNER JOIN (
  SELECT channel_id, MAX(last_visit) as last_visit
  FROM user_youtubes
  INNER JOIN youtubes on user_youtubes.youtube_id = youtubes.id
  GROUP BY channel_id
) as recent_visits on youtube_channels.id = recent_visits.channel_id;