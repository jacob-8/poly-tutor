INSERT INTO auth.users ("aud", "email", "id", "instance_id", "role") VALUES
('authenticated', 'seeded@mock.com', '5e040c00-ce26-4f2f-8413-e0985ec1f4b2', '00000000-0000-0000-0000-000000000000', 'authenticated');

INSERT INTO youtube_channels ("description", "id", "subscriber_count", "thumbnail_url", "title", "video_count", "view_count") VALUES
(null, 'UC-7jKPgRmLBiB1ltbABubNA', null, 'https://yt3.ggpht.com/ytc/APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s', '小白的奇幻旅行', null, null),
('Learn Code', 'UC8butISFwT-Wl7EV0hUK0BQ', 8810000, 'https://yt3.ggpht.com/ytc/APkrFKaqca-xQcJtp1Pqv-APucCa0nToHYGPVT00YBGOSw', 'freeCodeCamp.org', 1500, 1003000405);

INSERT INTO youtubes ("channel_id", "chapters", "description", "duration_seconds", "id", "language", "like_count", "published_at", "title", "view_count") VALUES
('UC-7jKPgRmLBiB1ltbABubNA', '{"{\"start_ms\":0,\"end_ms\":300000}","{\"start_ms\":300000,\"end_ms\":600000}"}'::jsonb[], '{"{\"text\":\"YouTube 上沒有字幕的視頻，但字幕是使用 Whisper 轉錄的。\",\"translation\":{\"en\":\"The video on YouTube does not have subtitles, but the subtitles are transcribed using Whisper.\"}}","{\"text\":\"然後補充了一個總結。\",\"translation\":{\"en\":\"Then a summary is added.\"}}"}'::jsonb[], 614.2, '9ruqSX_p_48', 'zh', 7700, '2023-02-28T04:00:13Z', '{"{\"text\":\"自驾游贵州黔东南，花50元买了个竹篓，是不是特别洋气？\",\"translation\":{\"en\":\"Self-driving tour in Qiandongnan, Guizhou. Bought a bamboo basket for 50 yuan, isnt it stylish?\"}}","{\"text\":\"【小白的奇幻旅行】\",\"translation\":{\"en\":\"【Xiao Bai''s Fantastic Journey】\"}}"}'::jsonb[], 136000),
('UC-7jKPgRmLBiB1ltbABubNA', '{"{\"start_ms\":0,\"end_ms\":300000}","{\"start_ms\":300000,\"end_ms\":600000}"}'::jsonb[], '{"{\"text\":\"YouTube 上沒有字幕的視頻，但字幕是使用 Whisper 轉錄的。\",\"translation\":{\"en\":\"The video on YouTube does not have subtitles, but the subtitles are transcribed using Whisper.\"}}","{\"text\":\"然後補充了一個總結。\",\"translation\":{\"en\":\"Then a summary is added.\"}}"}'::jsonb[], 534, 'UnlyETVcDzY', 'zh', null, null, '{"{\"text\":\"一位老人騎驢帶回200棵蘋果樹苗，讓村莊煥然一新 – 真是太神奇了！\",\"translation\":{\"en\":\"An Elder Transforms a Village by Bringing Back 200 Apple Saplings with a Donkey – Truly Amazing!\"}}"}'::jsonb[], null),
('UC-7jKPgRmLBiB1ltbABubNA', '{"{\"start_ms\":0,\"end_ms\":300000}","{\"start_ms\":300000,\"end_ms\":600000}"}'::jsonb[], '{"{\"text\":\"這段視頻展示了老奶奶如何在黃土高坡上用自己的雙手改造家園。\",\"translation\":{\"en\":\"This video shows how the grandma transforms her home with her own hands on the Loess Plateau.\"}}","{\"text\":\"她的院落不僅充滿綠色植物，還有許多傳統裝飾，充滿了鄉村的魅力。\",\"translation\":{\"en\":\"Her courtyard is filled with green plants and numerous traditional decorations, brimming with rural charm.\"}}"}'::jsonb[], 631, 'GlctfUFhbaM', 'zh', null, null, '{"{\"text\":\"在黄土高坡上，老奶奶打造出美丽乡村院落，美得像世外桃源啊【小白的奇幻旅行】\",\"translation\":{\"en\":\"On the Loess Plateau, a Grandma Creates a Beautiful Rural Courtyard, As Lovely as a Hidden Paradise【Xiao Bais Fantastic Journey】\"}}"}'::jsonb[], null),
('UC8butISFwT-Wl7EV0hUK0BQ', '{"{\"start_ms\":0,\"end_ms\":300000}","{\"start_ms\":300000,\"end_ms\":600000}"}'::jsonb[], '{"{\"text\":\"This tutorial offers an in-depth guide on using LangChain.js to create powerful language model applications leveraging JavaScript and OpenAI technologies.\",\"translation\":{\"zh-CN\":\"本教程提供了使用LangChain.js结合JavaScript和OpenAI技术创建强大语言模型应用的深入指南。\"}}","{\"text\":\"It covers everything from setup to advanced features, making it ideal for developers looking to integrate AI into their web applications.\",\"translation\":{\"zh-CN\":\"它涵盖了从设置到高级功能的所有内容，非常适合希望将AI集成到其网络应用程序中的开发人员。\"}}"}'::jsonb[], 5940, 'HSZ_uaif57o', 'en', null, null, '{"{\"text\":\"Learn LangChain.js - Build LLM apps with JavaScript and OpenAI\",\"translation\":{\"zh-CN\":\"学习LangChain.js - 使用JavaScript和OpenAI构建LLM应用\"}}"}'::jsonb[], null),
('UC8butISFwT-Wl7EV0hUK0BQ', '{"{\"start_ms\":0,\"end_ms\":300000}","{\"start_ms\":300000,\"end_ms\":600000}"}'::jsonb[], '{"{\"text\":\"This comprehensive course offers a deep dive into the world of computer science, covering fundamental concepts and practical skills taught at Harvard University.\",\"translation\":{\"zh-TW\":\"這門全面的課程深入探討計算機科學的世界，涵蓋哈佛大學教授的基礎概念和實用技能。\"}}","{\"text\":\"From programming basics to advanced algorithms, this course is an excellent resource for anyone interested in pursuing a career in technology.\",\"translation\":{\"zh-TW\":\"從編程基礎到高級算法，這門課程對任何有興趣從事科技行業職業生涯的人來說都是絕佳資源。\"}}"}'::jsonb[], 2058, '8mAITcNt710', 'en', null, null, '{"{\"text\":\"Harvard CS50 – Full Computer Science University Course\",\"translation\":{\"zh-TW\":\"哈佛大學CS50 - 完整的計算機科學大學課程\"}}"}'::jsonb[], null);

INSERT INTO youtube_transcripts ("created_by", "sentences", "source", "youtube_id") VALUES
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', '{"{\"start_ms\":0,\"end_ms\":2000,\"text\":\"在贵州的第一天，我们就遇到了一位非常热情的当地人。\"}","{\"start_ms\":2000,\"end_ms\":4000,\"text\":\"他推荐我们去尝试当地的特色美食，真是太美味了！\"}","{\"start_ms\":4000,\"end_ms\":6000,\"text\":\"今天我们参观了一个古老的苗族村落，那里的风俗真是独特。\"}","{\"start_ms\":6000,\"end_ms\":8000,\"text\":\"我被那里的手工艺品深深吸引，最后买了一个手织的挎包。\"}","{\"start_ms\":8000,\"end_ms\":10000,\"text\":\"我们在黔东南的山路上自驾，风景实在是太壮观了。\"}","{\"start_ms\":10000,\"end_ms\":12000,\"text\":\"下午我们去了一个当地的市场，那里的热闹程度超乎我的想象。\"}","{\"start_ms\":12000,\"end_ms\":14000,\"text\":\"我尝试了一种当地的传统小吃，味道真是让人难忘。\"}","{\"start_ms\":14000,\"end_ms\":16000,\"text\":\"晚上，我们在村子里的一个小旅馆住下，感受到了乡村的宁静。\"}","{\"start_ms\":16000,\"end_ms\":18000,\"text\":\"村里的孩子们对我们的相机特别好奇，我们拍了很多照片。\"}","{\"start_ms\":18000,\"end_ms\":20000,\"text\":\"这次自驾游让我对贵州的自然风光和文化有了更深的了解。\"}"}'::jsonb[], 'spoofing', '9ruqSX_p_48'),
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', '{"{\"text\":\"Mocked: 這是模仿翻譯的假抄本。\"}"}'::jsonb[], 'spoofing', 'UnlyETVcDzY'),
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', '{"{\"text\":\"Hello, everyone, and welcome to this video where I will show you how to use LangChain.js to build a language model application.\",\"translation\":{\"zh-TW\":\"大家好，歡迎來到這個視頻，在這個視頻中，我將向您展示如何使用LangChain.js來構建語言模型應用程序。\"}}","{\"text\":\"So we are going to be using JavaScript and OpenAI to build a language model application.\"}","{\"text\":\"This is going to be a lot of fun.\"}","{\"text\":\"Lets get started.\"}","{\"text\":\"So the first thing we need to do is go to the LangChain.js website.\"}","{\"text\":\"So this is LangChain.js.\"}"}'::jsonb[], 'spoofing', 'HSZ_uaif57o');

INSERT INTO youtube_summaries ("created_by", "end_ms", "sentences", "source", "start_ms", "youtube_id") VALUES
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 300000, '{"{\"text\":\"用於測試目的的非常簡短但虛假的摘要。\"}","{\"text\":\"这次自驾游让我对贵州的自然风光和文化有了更深的了解。\"}","{\"text\":\"这次自驾游让我对贵州的自然风光和文化有了更深的了解。\"}","{\"text\":\"这次自驾游让我对贵州的自然风光和文化有了更深的了解。\"}","{\"text\":\"这次自驾游让我对贵州的自然风光和文化有了更深的了解。\"}"}'::jsonb[], 'spoofing', 0, '9ruqSX_p_48'),
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 600000, '{"{\"text\":\"这次自驾游让我对贵州的自然风光和文化有了更深的了解。\"}","{\"text\":\"用於測試目的的非常簡短但虛假的摘要。\"}"}'::jsonb[], 'spoofing', 300000, '9ruqSX_p_48'),
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 10000, '{"{\"text\":\"A tutorial showing how to use LangChain.js to build a language model application.\"}"}'::jsonb[], 'spoofing', 0, 'HSZ_uaif57o');

INSERT INTO word_updates ("created_by", "language", "status", "views", "word") VALUES
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 'en', 0, 5, 'hello'),
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 'en', 1, 2, 'world'),
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 'zh', 2, 3, '你好'),
('5e040c00-ce26-4f2f-8413-e0985ec1f4b2', 'zh', 3, 4, '世界');
