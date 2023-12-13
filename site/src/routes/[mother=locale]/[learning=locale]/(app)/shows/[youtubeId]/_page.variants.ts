import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockLayoutData } from '$lib/mocks/data/page'

export const variants: Variant<Component>[] = [
  {
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        youtube_id: 'psHi-KSFuwQ',
        'youtube': {
          'id': 'psHi-KSFuwQ',
          'title': '我终于换了一身新衣服，去见一位很重要的人，仪式感满满！【小白的奇幻旅行】',
          'description': '哈喽大家好，小白来YouTube啦！\n这里是我在YouTube的唯一官方频道：小白的奇幻旅行\n\n带上🐶金毛安妮，马犬波妞，开着床车大黑，来一场疯狂的人文苦旅\n\n从甘肃开始漫游整个中国，如果你对我分享的视频感兴趣\n欢迎多多点赞、评论以及订阅我的频道：\nhttps://bit.ly/xiaobaiqihuanlvxing\n\n欢迎关注我的Facebook主页: https://bit.ly/3bmVXJ5\n\n更多精彩：\n【自驾西藏】：https://bit.ly/2GUdBIk\n【自驾新疆】：https://bit.ly/373icTo\n【自驾甘肃】：https://bit.ly/30Rb3SL\n【自驾云南】：https://bit.ly/3djqBDn\n【自驾贵州】：https://bit.ly/3EFvT8m\n\n#小白的奇幻旅行 #旅行 #甘肃 #自驾游 #环游中国\n\n--------------------------------------------------------------------------------\n\nSubscribe to our channel: https://bit.ly/xiaobaiqihuanlvxing\nFollow my Facebook Page: https://bit.ly/3bmVXJ5\n\nHi, I\'m XiaoBai.\nTravel through China with my two dogs🐶 Annie and Ponyo.\nAnnie is a Golden Retriever and Ponyo is a Belgian Malinois.\n\nMore Videos👇👇👇\n\n【Travel Tibet】：https://bit.ly/2GUdBIk\n【Travel Xinjiang】：https://bit.ly/373icTo\n【Travel Gansu】：https://bit.ly/30Rb3SL\n【Travel Yunnan】：https://bit.ly/3djqBDn\n【Travel Guizhou】：https://bit.ly/3EFvT8m\nIf you like our videos, please like, comment, and share our videos😝\n\nSupport us here! （Donation）赞赏支持\n贝宝（Paypal）：https://paypal.me/jianxiaobai?locale.x=zh_XC\n支付宝（Alipay）：244576982@qq.com',
          'duration_seconds': null,
          'language': 'zh',
          'channel_id': 'UC-7jKPgRmLBiB1ltbABubNA',
          'created_at': '2023-12-12T06:34:27.299482+00:00'
        },
        streamed: {
          cedict: new Promise((resolve) => { setTimeout(() => resolve({}), 3000) }),
        },
        // @ts-ignore
        remove_from_my_videos: (youtube_id) => { alert(`remove_from_my_videos(${youtube_id})`)},
      }
    },
  },
]

