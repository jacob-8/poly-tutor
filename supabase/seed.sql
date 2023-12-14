insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at) 
values ('00000000-0000-0000-0000-000000000000', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 'authenticated', 'authenticated', 'jim@gmail.com', '$2a$10$Iw/2HLcgRMoXLslFxZXFC.8bxpDZnDhrj.NVGZ20H4T/OLq2HzCcy', '2023-01-11 16:54:12.7991+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL);

-- learn from others https://github.com/search?q=path%3A*supabase%2Fseed.sql&type=code
-- https://www.youtube.com/channel/UC8butISFwT-Wl7EV0hUK0BQ
-- https://www.youtube.com/watch?v=8mAITcNt710

INSERT INTO youtube_channels (id, title, thumbnail_url) 
VALUES 
  ('UC-7jKPgRmLBiB1ltbABubNA', '小白的奇幻旅行', 'https://yt3.ggpht.com/ytc/APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s'), -- Chinese
  ('UC8butISFwT-Wl7EV0hUK0BQ', 'freeCodeCamp.org', 'https://yt3.ggpht.com/ytc/APkrFKaqca-xQcJtp1Pqv-APucCa0nToHYGPVT00YBGOSw'); -- English

INSERT INTO youtubes ("language", channel_id, id, title, "description", duration_seconds)
VALUES
  ('zh', 'UC-7jKPgRmLBiB1ltbABubNA', '9ruqSX_p_48', '自驾游贵州黔东南，花50元买了个竹篓，是不是特别洋气？【小白的奇幻旅行】', 'description here...', 614), -- Chinese w/o captions originally
  ('zh', 'UC-7jKPgRmLBiB1ltbABubNA', 'UnlyETVcDzY', 'An Elder Transforms a Village by Bringing Back 200 Apple Saplings with a Donkey – Truly Amazing!', 'description here...', 534), -- Chinese w/o captions originally
  ('zh', 'UC-7jKPgRmLBiB1ltbABubNA', 'GlctfUFhbaM', '在黄土高坡上，老奶奶打造出美丽乡村院落，美得像世外桃源啊【小白的奇幻旅行】', 'description here...', 631), -- Chinese w/o captions originally
  ('en', 'UC8butISFwT-Wl7EV0hUK0BQ', '8mAITcNt710', 'Harvard CS50 – Full Computer Science University Course', 'description here...', 2058);

-- More YouTube video options
-- 9OkddyYQBec AI數學文化營
-- Ukr40eBfeyg 農夫
-- HRenI3LURNk 南橫公路全線通車
-- lpyKfNjTZi8 Llama2

INSERT INTO youtube_transcripts (youtube_id, transcript, transcript_source, created_by)
VALUES
  ('9ruqSX_p_48', '{"key": "value", "key2": "value2"}'::jsonb, 'spoofing', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2'),
  ('UnlyETVcDzY', '{"key": "value", "key2": "value2"}'::jsonb, 'spoofing', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2'); 

INSERT INTO youtube_summaries (youtube_id, summary, summary_source, start_ms, end_ms, created_by)
VALUES
  ('9ruqSX_p_48', 'This is a fake summary...', 'spoofing', '0', '10000', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2'); 
