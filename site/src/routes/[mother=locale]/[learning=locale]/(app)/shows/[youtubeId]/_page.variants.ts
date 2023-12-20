import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockBobUser, mockLayoutData } from '$lib/mocks/data/page'
import type { YouTube } from '$lib/supabase/database.types'
import { writable } from 'svelte/store'
import type { Sentence } from '$lib/types'

const youtube: YouTube = {
  id: 'psHi-KSFuwQ',
  title: '我终于换了一身新衣服，去见一位很重要的人，仪式感满满！【小白的奇幻旅行】',
  description: '哈喽大家好，小白来YouTube啦！\n这里是我在YouTube的唯一官方频道：小白的奇幻旅行\n\n带上🐶金毛安妮，马犬波妞，开着床车大黑，来一场疯狂的人文苦旅\n\n从甘肃开始漫游整个中国，如果你对我分享的视频感兴趣\n欢迎多多点赞、评论以及订阅我的频道：\nhttps://bit.ly/xiaobaiqihuanlvxing\n\n欢迎关注我的Facebook主页: https://bit.ly/3bmVXJ5\n\n更多精彩：\n【自驾西藏】：https://bit.ly/2GUdBIk\n【自驾新疆】：https://bit.ly/373icTo\n【自驾甘肃】：https://bit.ly/30Rb3SL\n【自驾云南】：https://bit.ly/3djqBDn\n【自驾贵州】：https://bit.ly/3EFvT8m\n\n#小白的奇幻旅行 #旅行 #甘肃 #自驾游 #环游中国\n\n--------------------------------------------------------------------------------\n\nSubscribe to our channel: https://bit.ly/xiaobaiqihuanlvxing\nFollow my Facebook Page: https://bit.ly/3bmVXJ5\n\nHi, I\'m XiaoBai.\nTravel through China with my two dogs🐶 Annie and Ponyo.\nAnnie is a Golden Retriever and Ponyo is a Belgian Malinois.\n\nMore Videos👇👇👇\n\n【Travel Tibet】：https://bit.ly/2GUdBIk\n【Travel Xinjiang】：https://bit.ly/373icTo\n【Travel Gansu】：https://bit.ly/30Rb3SL\n【Travel Yunnan】：https://bit.ly/3djqBDn\n【Travel Guizhou】：https://bit.ly/3EFvT8m\nIf you like our videos, please like, comment, and share our videos😝\n\nSupport us here! （Donation）赞赏支持\n贝宝（Paypal）：https://paypal.me/jianxiaobai?locale.x=zh_XC\n支付宝（Alipay）：244576982@qq.com',
  duration_seconds: null,
  language: 'zh',
  channel_id: 'UC-7jKPgRmLBiB1ltbABubNA',
  created_at: '2023-12-12T06:34:27.299482+00:00'
}

export const variants: Variant<Component>[] = [
  {
    name: 'no user',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        youtube_id: 'psHi-KSFuwQ',
        youtube,
        streamed: {
          cedict: new Promise((resolve) => { setTimeout(() => resolve({}), 3000) }),
          // @ts-ignore
          transcript: new Promise((resolve) => { setTimeout(() => resolve({ transcript: {sentences: [{text: 'hi world'}]}}), 1000) }),
          // @ts-ignore
          summary: new Promise((resolve) => { setTimeout(() => resolve(null), 1000) }),
        },
        addSummary: async ({openai_api_key, sentences}: {openai_api_key: string, sentences: Sentence[]}) => {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          alert(`Would use openai_api_key: ${openai_api_key} for ${sentences.length} sentences}`)
        },
        // @ts-ignore
        remove_from_my_videos: (youtube_id) => { alert(`remove_from_my_videos(${youtube_id})`)},
      }
    },
  },
  {
    name: 'user',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        user: mockBobUser,
        user_vocabulary: writable(['你好']),
        youtube_id: 'psHi-KSFuwQ',
        youtube,
        streamed: {
          cedict: new Promise((resolve) => { setTimeout(() => resolve({}), 1000) }),
          // @ts-ignore
          transcript: new Promise((resolve) => { setTimeout(() => resolve({ transcript: {sentences: [
            { 'text': '在贵州的第一天，我们就遇到了一位非常热情的当地人。' },
            { 'text': '他推荐我们去尝试当地的特色美食，真是太美味了！' },
            { 'text': '今天我们参观了一个古老的苗族村落，那里的风俗真是独特。' },
            { 'text': '我被那里的手工艺品深深吸引，最后买了一个手织的挎包。' },
            { 'text': '我们在黔东南的山路上自驾，风景实在是太壮观了。' },
            { 'text': '下午我们去了一个当地的市场，那里的热闹程度超乎我的想象。' },
            { 'text': '我尝试了一种当地的传统小吃，味道真是让人难忘。' },
            { 'text': '晚上，我们在村子里的一个小旅馆住下，感受到了乡村的宁静。' },
            { 'text': '村里的孩子们对我们的相机特别好奇，我们拍了很多照片。' },
            { 'text': '这次自驾游让我对贵州的自然风光和文化有了更深的了解。' }
          ]
          }}), 0) }),
          // @ts-ignore
          summary: new Promise((resolve) => { setTimeout(() => resolve({ summary: {sentences: [
            { 'text': '在贵州的第一天，我们就遇到了一位非常热情的当地人。' },
            { 'text': '他推荐我们去尝试当地的特色美食，真是太美味了！' },
            { 'text': '今天我们参观了一个古老的苗族村落，那里的风俗真是独特。' },
            { 'text': '我被那里的手工艺品深深吸引，最后买了一个手织的挎包。' },
            { 'text': '我们在黔东南的山路上自驾，风景实在是太壮观了。' },
            { 'text': '下午我们去了一个当地的市场，那里的热闹程度超乎我的想象。' },
            { 'text': '我尝试了一种当地的传统小吃，味道真是让人难忘。' },
            { 'text': '晚上，我们在村子里的一个小旅馆住下，感受到了乡村的宁静。' },
            { 'text': '村里的孩子们对我们的相机特别好奇，我们拍了很多照片。' },
            { 'text': '这次自驾游让我对贵州的自然风光和文化有了更深的了解。' }
          ]}}), 1000) }),
        },
        // @ts-ignore
        check_is_in_my_videos: (youtube_id) => { console.info(`check_is_in_my_videos(${youtube_id})`)},
        // @ts-ignore
        remove_from_my_videos: (youtube_id) => { alert(`remove_from_my_videos(${youtube_id})`)},
      }
    },
  },
]

