import type { LocaleCode } from '$lib/i18n/locales'
import type { ChatMessageAnalyzedWithTranslation, ChatMessageWithTranslation, Sentence } from '$lib/types'
import { split_into_sentences } from '$lib/utils/split-into-sentences'
import type { ChatCompletionRequestMessage } from 'openai-edge'
import { get, writable, type Readable } from 'svelte/store'
import type { StreamingStoreArguments } from './create-streaming-store'
import { get_openai_api_key } from '$lib/client/UserInfo.svelte'

const SENTENCE_ENDING_PUNCTUATION = /[.?!。？！]/g

export function create_chat_store({split_sentences, mother, learning, translate, create_streaming_store }: {
  split_sentences: (sentences: Sentence[]) => Promise<Sentence[]>
  mother: LocaleCode
  learning: LocaleCode
  translate: (text: string, from: LocaleCode, to: LocaleCode) => Promise<string>
  create_streaming_store: (args: StreamingStoreArguments) => Readable<string>
}) {
  const thread = writable<ChatMessageAnalyzedWithTranslation[]>([])
  const is_receiving = writable(false)
  const error = writable<string>(null)

  async function add_chat_history(messages: ChatMessageWithTranslation[]) {
    const analyzed_messages = await Promise.all(messages.map(async (message) => {
      if (message.role === 'system') return message

      return {
        role: message.role,
        sentences: await split_sentences(message.sentences),
      }
    }))
    thread.set(analyzed_messages)
  }

  function send_query(query: string) {
    error.set(null)

    const openai_api_key = get_openai_api_key() // TODO, pass in this method
    if (!openai_api_key) return

    is_receiving.set(true)
    const thread_messages = get(thread)
    const query_message_index = thread_messages.length
    const receiving_message_index = query_message_index + 1
    const receiving_message: ChatMessageWithTranslation = {
      role: 'assistant',
      sentences: [],
    }
    let current_sentence_streaming_in = ''
    let current_sentence_streaming_index = 0

    const thread_in_chatbot_format = thread_messages.map((message) => {
      return {
        role: message.role,
        content: message.sentences.map(({text}) => text).join(' ')
      }
    })

    const messages_to_send: ChatCompletionRequestMessage[] = [
      ...thread_in_chatbot_format,
      {
        role: 'user',
        content: query,
      },
    ]

    const query_sentences = split_into_sentences(query).map((text) => ({ text }))
    thread.update((messages) => [
      ...messages,
      {
        role: 'user',
        sentences: query_sentences,
      }
    ])
    // Maybe: analyze query and add to thread
    // split_sentences(query_sentences).then((sentences) => {
    //   thread.set([
    //     ...thread_messages,
    //     {
    //       role: 'user',
    //       sentences
    //     }
    //   ])
    // })

    const unsubscribe = create_streaming_store({messages: messages_to_send, api_key: openai_api_key}).subscribe((content) => {
      if (content === '[DONE]') {
        end_of_sentence()
        unsubscribe()
        return is_receiving.set(false)
      }

      if (content.startsWith('[ERROR]')) {
        error.set(content.split(']').pop())
        unsubscribe()
        return is_receiving.set(false)
      }

      current_sentence_streaming_in += content
      if (current_sentence_streaming_in.match(SENTENCE_ENDING_PUNCTUATION))
        end_of_sentence()
    })

    async function end_of_sentence() {
      if (!current_sentence_streaming_in) return

      const sentence_index = current_sentence_streaming_index
      const new_sentence: Sentence = { text: current_sentence_streaming_in }

      current_sentence_streaming_in = ''
      current_sentence_streaming_index++

      const [analyzed_sentence] = await split_sentences([new_sentence])
      receiving_message.sentences[sentence_index] = analyzed_sentence

      thread.update((messages) => {
        messages[receiving_message_index] = receiving_message
        return messages
      })

      const translation = await translate(new_sentence.text, learning, mother)
      const analyzed_sentence_with_translation = {
        ...analyzed_sentence,
        translation: {
          [mother]: translation,
        }
      }

      receiving_message.sentences[sentence_index] = analyzed_sentence_with_translation
      thread.update((messages) => {
        messages[receiving_message_index] = receiving_message
        return messages
      })
    }
  }

  return {
    add_chat_history,
    thread,
    send_query,
    is_receiving,
    error,
  }
}
