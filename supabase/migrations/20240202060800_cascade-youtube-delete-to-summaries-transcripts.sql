ALTER TABLE youtube_transcripts
DROP CONSTRAINT youtube_transcripts_youtube_id_fkey,
ADD CONSTRAINT youtube_transcripts_youtube_id_fkey FOREIGN KEY (youtube_id) REFERENCES youtubes (id) ON DELETE CASCADE;

ALTER TABLE youtube_summaries
DROP CONSTRAINT youtube_summaries_youtube_id_fkey,
ADD CONSTRAINT youtube_summaries_youtube_id_fkey FOREIGN KEY (youtube_id) REFERENCES youtubes (id) ON DELETE CASCADE;