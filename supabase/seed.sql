insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at) 
values ('00000000-0000-0000-0000-000000000000', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 'authenticated', 'authenticated', 'seeded@mock.com', '$2a$10$Iw/2HLcgRMoXLslFxZXFC.8bxpDZnDhrj.NVGZ20H4T/OLq2HzCcy', '2023-01-11 16:54:12.7991+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL);

INSERT INTO youtube_channels (id, title, thumbnail_url) 
VALUES 
  ('UC-7jKPgRmLBiB1ltbABubNA', '小白的奇幻旅行', 'https://yt3.ggpht.com/ytc/APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s'),
  ('UC8butISFwT-Wl7EV0hUK0BQ', 'freeCodeCamp.org', 'https://yt3.ggpht.com/ytc/APkrFKaqca-xQcJtp1Pqv-APucCa0nToHYGPVT00YBGOSw');

INSERT INTO youtubes ("language", channel_id, id, title, "description", duration_seconds)
VALUES
  ('zh', 'UC-7jKPgRmLBiB1ltbABubNA', '9ruqSX_p_48', '自驾游贵州黔东南，花50元买了个竹篓，是不是特别洋气？【小白的奇幻旅行】', 'description here...', 614),
  ('zh', 'UC-7jKPgRmLBiB1ltbABubNA', 'UnlyETVcDzY', 'An Elder Transforms a Village by Bringing Back 200 Apple Saplings with a Donkey – Truly Amazing!', 'description here...', 534),
  ('zh', 'UC-7jKPgRmLBiB1ltbABubNA', 'GlctfUFhbaM', '在黄土高坡上，老奶奶打造出美丽乡村院落，美得像世外桃源啊【小白的奇幻旅行】', 'description here...', 631),
  ('en', 'UC8butISFwT-Wl7EV0hUK0BQ', '8mAITcNt710', 'Harvard CS50 – Full Computer Science University Course', 'description here...', 2058);

INSERT INTO youtube_transcripts (youtube_id, transcript, transcript_source, created_by)
VALUES
  ('9ruqSX_p_48', '{"sentences": [{"text":"This is a fake transcript..."},{"text":"在贵州的第一天，我们就遇到了一位非常热情的当地人。"},{"text":"他推荐我们去尝试当地的特色美食，真是太美味了！"},{"text":"今天我们参观了一个古老的苗族村落，那里的风俗真是独特。"},{"text":"我被那里的手工艺品深深吸引，最后买了一个手织的挎包。"},{"text":"我们在黔东南的山路上自驾，风景实在是太壮观了。"},{"text":"下午我们去了一个当地的市场，那里的热闹程度超乎我的想象。"},{"text":"我尝试了一种当地的传统小吃，味道真是让人难忘。"},{"text":"晚上，我们在村子里的一个小旅馆住下，感受到了乡村的宁静。"},{"text":"村里的孩子们对我们的相机特别好奇，我们拍了很多照片。"},{"text":"这次自驾游让我对贵州的自然风光和文化有了更深的了解。"}]}'::jsonb, 'spoofing', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2'),
  ('UnlyETVcDzY', '{"sentences": [{ "text": "This is a fake transcript..." }]}'::jsonb, 'spoofing', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2'); 

INSERT INTO youtube_summaries (youtube_id, summary, summary_source, start_ms, end_ms, created_by)
VALUES
  ('9ruqSX_p_48', '{"sentences": [{ "text": "This is a fake summary..." }]}'::jsonb, 'spoofing', '0', '10000', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2'); 
