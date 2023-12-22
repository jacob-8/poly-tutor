INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at) 
VALUES ('00000000-0000-0000-0000-000000000000', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 'authenticated', 'authenticated', 'seeded@mock.com', '$2a$10$Iw/2HLcgRMoXLslFxZXFC.8bxpDZnDhrj.NVGZ20H4T/OLq2HzCcy', '2023-01-11 16:54:12.7991+00', NULL, '', NULL, '', NULL, '', '', NULL, '2023-01-11 16:54:12.801124+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2023-01-11 16:54:12.796822+00', '2023-01-11 16:54:12.80197+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL);

INSERT INTO youtube_channels ("description", "id", "subscriber_count", "thumbnail_url", "title", "video_count", "view_count") VALUES
(null, 'UC-7jKPgRmLBiB1ltbABubNA', null, 'https://yt3.ggpht.com/ytc/APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s', '小白的奇幻旅行', null, null),
('Learn Code', 'UC8butISFwT-Wl7EV0hUK0BQ', 8810000, 'https://yt3.ggpht.com/ytc/APkrFKaqca-xQcJtp1Pqv-APucCa0nToHYGPVT00YBGOSw', 'freeCodeCamp.org', 1500, 1003000405);

INSERT INTO youtubes ("channel_id", "description", "duration_seconds", "id", "language", "like_count", "published_at", "title", "view_count") VALUES
('UC-7jKPgRmLBiB1ltbABubNA', 'A video that has no captions on YouTube, but captions were transcribed using Whisper. Then a summary was added.', 614.2, '9ruqSX_p_48', 'zh', 7700, '2023-02-28T04:00:13Z', '自驾游贵州黔东南，花50元买了个竹篓，是不是特别洋气？【小白的奇幻旅行】', 136000),
('UC-7jKPgRmLBiB1ltbABubNA', 'A video that has no captions on YouTube, but captions were transcribed using Whisper.', 534, 'UnlyETVcDzY', 'zh', null, null, 'An Elder Transforms a Village by Bringing Back 200 Apple Saplings with a Donkey – Truly Amazing!', null),
('UC-7jKPgRmLBiB1ltbABubNA', 'description here...', 631, 'GlctfUFhbaM', 'zh', null, null, '在黄土高坡上，老奶奶打造出美丽乡村院落，美得像世外桃源啊【小白的奇幻旅行】', null),
('UC8butISFwT-Wl7EV0hUK0BQ', 'description here...', 5940, 'HSZ_uaif57o', 'en', null, null, 'Learn LangChain.js - Build LLM apps with JavaScript and OpenAI', null),
('UC8butISFwT-Wl7EV0hUK0BQ', 'description here...', 2058, '8mAITcNt710', 'en', null, null, 'Harvard CS50 – Full Computer Science University Course', null);

INSERT INTO youtube_transcripts ("created_by", "transcript", "transcript_source", "youtube_id") VALUES
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', '{"sentences":[{"text":"在贵州的第一天，我们就遇到了一位非常热情的当地人。"},{"text":"他推荐我们去尝试当地的特色美食，真是太美味了！"},{"text":"今天我们参观了一个古老的苗族村落，那里的风俗真是独特。"},{"text":"我被那里的手工艺品深深吸引，最后买了一个手织的挎包。"},{"text":"我们在黔东南的山路上自驾，风景实在是太壮观了。"},{"text":"下午我们去了一个当地的市场，那里的热闹程度超乎我的想象。"},{"text":"我尝试了一种当地的传统小吃，味道真是让人难忘。"},{"text":"晚上，我们在村子里的一个小旅馆住下，感受到了乡村的宁静。"},{"text":"村里的孩子们对我们的相机特别好奇，我们拍了很多照片。"},{"text":"这次自驾游让我对贵州的自然风光和文化有了更深的了解。"}]}'::jsonb, 'spoofing', '9ruqSX_p_48'),
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', '{"sentences":[{"text":"This is a fake transcript..."}]}'::jsonb, 'spoofing', 'UnlyETVcDzY'),
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', '{"sentences":[{"text":"Hello, everyone, and welcome to this video where I will show you how to use LangChain.js to build a language model application.","translation":{"zh-TW":"大家好，歡迎來到這個視頻，在這個視頻中，我將向您展示如何使用LangChain.js來構建語言模型應用程序。"}},{"text":"So we are going to be using JavaScript and OpenAI to build a language model application."},{"text":"This is going to be a lot of fun."},{"text":"Lets get started."},{"text":"So the first thing we need to do is go to the LangChain.js website."},{"text":"So this is LangChain.js."}]}'::jsonb, 'spoofing', 'HSZ_uaif57o');

INSERT INTO youtube_summaries ("created_by", "end_ms", "start_ms", "summary", "summary_source", "youtube_id") VALUES
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 10000, 0, '{"sentences":[{"text":"A very short but fake summary for testing purposes."}]}'::jsonb, 'spoofing', '9ruqSX_p_48'),
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 10000, 0, '{"sentences":[{"text":"A tutorial showing how to use LangChain.js to build a language model application."}]}'::jsonb, 'spoofing', 'HSZ_uaif57o');
