import type { ChatCompletionRequestMessage } from 'openai-edge'
import { languageTutor } from '../../../routes/[mother=locale]/[learning=locale]/(app)/chat/personalities'

export const messages: ChatCompletionRequestMessage[] = [
  {role: 'system', content: languageTutor},
  {
    role: 'user',
    content: 'What are bananas?',
  },
  {
    role: 'assistant',
    content: '香蕉是一种水果。 (Bananas are a type of fruit.) 你喜欢吃香蕉吗？(Do you like eating bananas?)',
  },
  {
    role: 'user',
    content: '我喜欢吃香蕉。',
  },
  {
    role: 'assistant',
    content: '很好！香蕉是一种又健康又美味的水果。你通常什么时候吃香蕉？',
  },
  {
    role: 'user',
    content: '我通常在早上吃香蕉。',
  },
  {
    role: 'assistant',
    content: '早上吃香蕉是个不错的选择！香蕉含有丰富的能量和营养，可以给你一天的精力。你还喜欢在其他时间吃香蕉吗？',
  },
  // {
  //   role: 'user',
  //   content: '我也喜欢在午饭后吃香蕉。',
  // },
]
