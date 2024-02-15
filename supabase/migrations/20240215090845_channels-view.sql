CREATE VIEW user_youtube_channels AS
SELECT DISTINCT ON (channel_id)
  youtube_channels.id,
  youtube_channels.title,
  youtube_channels.description,
  youtube_channels.thumbnail_url,
  youtube_channels.subscriber_count,
  youtube_channels.video_count,
  youtube_channels.view_count,
  youtube_channels.updated_at,
  youtubes.language
FROM user_youtubes
INNER JOIN youtubes on user_youtubes.youtube_id = youtubes.id
INNER JOIN youtube_channels on youtubes.channel_id = youtube_channels.id;