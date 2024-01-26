ALTER TABLE word_updates
DROP CONSTRAINT word_updates_created_by_fkey,
ADD CONSTRAINT word_updates_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users (id) ON DELETE CASCADE;

ALTER TABLE user_youtubes
DROP CONSTRAINT user_youtubes_user_id_fkey,
ADD CONSTRAINT user_youtubes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE;
