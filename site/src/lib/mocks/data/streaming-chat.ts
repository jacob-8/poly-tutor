import { readable, writable } from 'svelte/store'
import { get_analysis_functions } from '$lib/analysis'
import { mockLayoutData } from './page'
import { create_chat_store } from '$lib/components/chat/create-chat-store'
import type { StreamingStoreArguments } from '$lib/components/chat/create-streaming-store'

const analysis_functions = get_analysis_functions({learning: 'zh-TW', mother: 'en', user_vocabulary: mockLayoutData.user_vocabulary, emphasis_limits: readable({high_view_count_max: 10, common_in_this_context_max: 10, improve_pronunciation_or_tone_max: 2})})
analysis_functions.then(() => console.info('analysis functions ready'))


export const chat = create_chat_store({
  split_sentences: (args) => analysis_functions.then(({split_sentences}) => split_sentences(args)),
  mother: 'en',
  learning: 'zh-TW',
  translate,
  create_streaming_store: create_mock_streaming_store,
})
chat.add_chat_history([
  {role: 'system', sentences: [{text: 'You are Poly Tutor, a multilingual chatbot.'}]},
  {role: 'user', sentences: [{text: '很好！'}]},
  {role: 'assistant', sentences: [{text: '香蕉是一种水果。'}]},
])

function create_mock_streaming_store(_args: StreamingStoreArguments) {
  const { subscribe, set } = writable('')

  const mock_message = '什麼是香蕉？ 我知道芒果很甜。'
  const tokens = Array.from(mock_message)
  let index = 0

  const intervalId = setInterval(() => {
    set(tokens[index])
    index++
    if (index === tokens.length) {
      clearInterval(intervalId)
      set('[DONE]')
    }
  }, 200)

  return { subscribe }
}

async function translate(text: string, _from: string, _to: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Translated' + text)
    }, 500)
  })
}
