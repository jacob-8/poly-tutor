ALTER TABLE youtube_summaries
DROP COLUMN sentences,
ADD COLUMN translations json not null;