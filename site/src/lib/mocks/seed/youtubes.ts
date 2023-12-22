import type { TablesInsert } from '$lib/supabase/generated.types'
export const seeded_user_id = '5e040c00-ce26-4f2f-8413-e0985ec1f4b2'

export interface YouTubeWithAllData {
  channel: TablesInsert<'youtube_channels'>
  youtube: TablesInsert<'youtubes'>
  transcripts?: TablesInsert<'youtube_transcripts'>[]
  summaries?: TablesInsert<'youtube_summaries'>[]
}

const xiao_bai_channel: TablesInsert<'youtube_channels'> = {
  id: 'UC-7jKPgRmLBiB1ltbABubNA',
  title: '小白的奇幻旅行',
  thumbnail_url: 'https://yt3.ggpht.com/ytc/APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s',
  description: null,
  subscriber_count: null,
  video_count: null,
  view_count: null,
}

const freeCodeCamp_channel: TablesInsert<'youtube_channels'> = {
  id: 'UC8butISFwT-Wl7EV0hUK0BQ',
  title: 'freeCodeCamp.org',
  thumbnail_url: 'https://yt3.ggpht.com/ytc/APkrFKaqca-xQcJtp1Pqv-APucCa0nToHYGPVT00YBGOSw',
  description: 'Learn Code',
  subscriber_count: 8810000,
  video_count: 1500,
  view_count: 1003000405,
}

export const zh_non_seeded: YouTubeWithAllData = {
  channel: xiao_bai_channel,
  youtube: {
    id: 'psHi-KSFuwQ',
    language: 'zh',
    channel_id: xiao_bai_channel.id,
    title: '我终于换了一身新衣服，去见一位很重要的人，仪式感满满！【小白的奇幻旅行】',
    description: '哈喽大家好，小白来YouTube啦！\n这里是我在YouTube的唯一官方频道：小白的奇幻旅行\n\n带上🐶金毛安妮，马犬波妞，开着床车大黑，来一场疯狂的人文苦旅\n\n从甘肃开始漫游整个中国，如果你对我分享的视频感兴趣\n欢迎多多点赞、评论以及订阅我的频道：\nhttps://bit.ly/xiaobaiqihuanlvxing\n\n欢迎关注我的Facebook主页: https://bit.ly/3bmVXJ5\n\n更多精彩：\n【自驾西藏】：https://bit.ly/2GUdBIk\n【自驾新疆】：https://bit.ly/373icTo\n【自驾甘肃】：https://bit.ly/30Rb3SL\n【自驾云南】：https://bit.ly/3djqBDn\n【自驾贵州】：https://bit.ly/3EFvT8m\n\n#小白的奇幻旅行 #旅行 #甘肃 #自驾游 #环游中国\n\n--------------------------------------------------------------------------------\n\nSubscribe to our channel: https://bit.ly/xiaobaiqihuanlvxing\nFollow my Facebook Page: https://bit.ly/3bmVXJ5\n\nHi, I\'m XiaoBai.\nTravel through China with my two dogs🐶 Annie and Ponyo.\nAnnie is a Golden Retriever and Ponyo is a Belgian Malinois.\n\nMore Videos👇👇👇\n\n【Travel Tibet】：https://bit.ly/2GUdBIk\n【Travel Xinjiang】：https://bit.ly/373icTo\n【Travel Gansu】：https://bit.ly/30Rb3SL\n【Travel Yunnan】：https://bit.ly/3djqBDn\n【Travel Guizhou】：https://bit.ly/3EFvT8m\nIf you like our videos, please like, comment, and share our videos😝\n\nSupport us here! （Donation）赞赏支持\n贝宝（Paypal）：https://paypal.me/jianxiaobai?locale.x=zh_XC\n支付宝（Alipay）：244576982@qq.com',
    duration_seconds: 1023,
  }
}

export const zh_transcribed_summarized: YouTubeWithAllData = {
  channel: xiao_bai_channel,
  youtube: {
    language: 'zh',
    channel_id: xiao_bai_channel.id,
    id: '9ruqSX_p_48',
    title: '自驾游贵州黔东南，花50元买了个竹篓，是不是特别洋气？【小白的奇幻旅行】',
    description: 'A video that has no captions on YouTube, but captions were transcribed using Whisper. Then a summary was added.',
    duration_seconds: 614.2, // write with decimal for clarity that this is a 'real' number
    published_at: '2023-02-28T04:00:13Z',
    view_count: 136000,
    like_count: 7700,
  },
  transcripts: [
    {
      youtube_id: '9ruqSX_p_48',
      transcript: {
        sentences: [
          { text: '在贵州的第一天，我们就遇到了一位非常热情的当地人。' },
          { text: '他推荐我们去尝试当地的特色美食，真是太美味了！' },
          { text: '今天我们参观了一个古老的苗族村落，那里的风俗真是独特。' },
          { text: '我被那里的手工艺品深深吸引，最后买了一个手织的挎包。' },
          { text: '我们在黔东南的山路上自驾，风景实在是太壮观了。' },
          { text: '下午我们去了一个当地的市场，那里的热闹程度超乎我的想象。' },
          { text: '我尝试了一种当地的传统小吃，味道真是让人难忘。' },
          { text: '晚上，我们在村子里的一个小旅馆住下，感受到了乡村的宁静。' },
          { text: '村里的孩子们对我们的相机特别好奇，我们拍了很多照片。' },
          { text: '这次自驾游让我对贵州的自然风光和文化有了更深的了解。' }
        ]
      },
      transcript_source: 'spoofing',
      created_by: seeded_user_id
    },
  ],
  summaries: [
    {
      youtube_id: '9ruqSX_p_48',
      summary: {
        sentences: [
          { text: 'A very short but fake summary for testing purposes.' }
        ]
      },
      summary_source: 'spoofing',
      start_ms: 0,
      end_ms: 10000,
      created_by: seeded_user_id
    }
  ],
}

export const zh_transcribed: YouTubeWithAllData = {
  channel: xiao_bai_channel,
  youtube: {
    language: 'zh',
    channel_id: xiao_bai_channel.id,
    id: 'UnlyETVcDzY',
    title: 'An Elder Transforms a Village by Bringing Back 200 Apple Saplings with a Donkey – Truly Amazing!',
    description: 'A video that has no captions on YouTube, but captions were transcribed using Whisper.',
    duration_seconds: 534
  },
  transcripts: [
    {
      youtube_id: 'UnlyETVcDzY',
      transcript: { sentences: [{ text: 'This is a fake transcript...' }] },
      transcript_source: 'spoofing',
      created_by: seeded_user_id
    }
  ]
}

export const zh_nothing: YouTubeWithAllData = {
  channel: xiao_bai_channel,
  youtube: {
    language: 'zh',
    channel_id: xiao_bai_channel.id,
    id: 'GlctfUFhbaM',
    title: '在黄土高坡上，老奶奶打造出美丽乡村院落，美得像世外桃源啊【小白的奇幻旅行】',
    description: 'description here...',
    duration_seconds: 631
  }
}

export const en_transcribed_translated_summarized: YouTubeWithAllData = {
  channel: freeCodeCamp_channel,
  youtube: {
    language: 'en',
    channel_id: freeCodeCamp_channel.id,
    id: 'HSZ_uaif57o',
    title: 'Learn LangChain.js - Build LLM apps with JavaScript and OpenAI',
    description: 'description here...',
    duration_seconds: 5940
  },
  transcripts: [
    {
      youtube_id: 'HSZ_uaif57o',
      transcript: {
        sentences: [
          {
            text: 'Hello, everyone, and welcome to this video where I will show you how to use LangChain.js to build a language model application.',
            translation: {
              'zh-TW': '大家好，歡迎來到這個視頻，在這個視頻中，我將向您展示如何使用LangChain.js來構建語言模型應用程序。'
            },
          },
          { text: 'So we are going to be using JavaScript and OpenAI to build a language model application.' },
          { text: 'This is going to be a lot of fun.' },
          { text: 'Lets get started.' },
          { text: 'So the first thing we need to do is go to the LangChain.js website.' },
          { text: 'So this is LangChain.js.' },
        ]
      },
      transcript_source: 'spoofing',
      created_by: seeded_user_id
    }
  ],
  summaries: [
    {
      youtube_id: 'HSZ_uaif57o',
      summary: {
        sentences: [
          { text: 'A tutorial showing how to use LangChain.js to build a language model application.' }
        ]
      },
      summary_source: 'spoofing',
      start_ms: 0,
      end_ms: 10000,
      created_by: seeded_user_id
    }
  ],
}

export const en_nothing: YouTubeWithAllData = {
  channel: freeCodeCamp_channel,
  youtube: {
    language: 'en',
    channel_id: freeCodeCamp_channel.id,
    id: '8mAITcNt710',
    title: 'Harvard CS50 – Full Computer Science University Course',
    description: 'description here...',
    duration_seconds: 2058
  }
}

export const seeded_youtubes: Record<string, YouTubeWithAllData> = {
  zh_transcribed_summarized,
  zh_transcribed,
  zh_nothing,
  en_transcribed_translated_summarized,
  en_nothing,
}

export const unseeded_youtubes: Record<'zh_captions_on_youtube__llama' | 'zh_no_captions__ai_camp', { id: string, language: 'zh' | 'en'}> = {
  zh_captions_on_youtube__llama: {
    id: 'lpyKfNjTZi8',
    language: 'zh',
    // title: '臉書 LLaMA 2 7b 中文大型語言模型 !',
  }, // https://www.youtube.com/watch?v=lpyKfNjTZi8
  zh_no_captions__ai_camp: {
    id: '9OkddyYQBec',
    language: 'zh',
  }, // https://www.youtube.com/watch?v=9OkddyYQBec
}

// More YouTube video options
// 9OkddyYQBec AI數學文化營
// Ukr40eBfeyg 農夫
// HRenI3LURNk 南橫公路全線通車
// lpyKfNjTZi8 Llama2

// export const natureShow = {
//   id: '-CTlz5PJRZs',
//   title: '4K Nature Treasures of Hawaii Botanical Garden - Jungle Forest Cinematic Virtual Walk (Slow Motion)',
//   description: 'hello',
//   duration_seconds: 122.521 * 60,
//   created_at: new Date().toISOString(),
//   language: 'en',
//   channel: {
//     id: 'UC8butISFwT-Wl7EV0hUK0BQ',
//     title: 'freeCodeCamp.org',
//     description: 'hello',
//     thumbnail_url: 'https://yt3.ggpht.com/ytc/APkrFKav44IZWeQMQttWjk2AsDi8oLkP1Mnf6zgIVu8s',
//   }
// }
