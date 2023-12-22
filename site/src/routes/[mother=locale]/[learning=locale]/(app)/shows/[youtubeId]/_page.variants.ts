import type { Variant } from 'kitbook'
import type Component from './+page.svelte'
import { mockBobUser, mockLayoutData } from '$lib/mocks/data/page'
import type { YouTube } from '$lib/supabase/database.types'
import { writable } from 'svelte/store'
import type { Sentence } from '$lib/types'
import { zh_non_seeded } from '$lib/mocks/seed/youtubes'

const youtube: YouTube = {
  ...zh_non_seeded.youtube,
  created_at: '2023-12-12T06:34:27.299482+00:00'
} as YouTube

export const variants: Variant<Component>[] = [
  {
    name: 'no user',
    languages: [],
    props: {
      data: {
        ...mockLayoutData,
        youtube,
        streamed: {
          cedict: new Promise((resolve) => { setTimeout(() => resolve({}), 3000) }),
          // @ts-ignore
          transcript: new Promise((resolve) => { setTimeout(() => resolve({ transcript: {sentences: [{text: 'hi world'}]}}), 1000) }),
          // @ts-ignore
          summary: new Promise((resolve) => { setTimeout(() => resolve(null), 1000) }),
        },
        addSummary: async ({sentences}: {sentences: Sentence[]}) => {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          alert(`Would transcribe ${sentences.length} sentences}`)
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

