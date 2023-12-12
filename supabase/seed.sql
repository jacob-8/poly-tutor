-- learn from others https://github.com/search?q=path%3A*supabase%2Fseed.sql&type=code
INSERT INTO youtube_channels (id, title, thumbnail_id) 
VALUES 
  ('UC8butISFwT-Wl7EV0hUK0BQ', 'freeCodeCamp.org', 'APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s');

-- https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ
-- Thumbnail ID fits into https://yt3.ggpht.com/ytc/APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s=s88-c-k-c0x00ffffff-no-rj

INSERT INTO youtubes (id, title, duration_seconds, "language", channel_id)
VALUES
  ('8mAITcNt710', 'Harvard CS50 – Full Computer Science University Course', 2058, 'en', 'UC8butISFwT-Wl7EV0hUK0BQ')

-- https://www.youtube.com/watch?v=8mAITcNt710
