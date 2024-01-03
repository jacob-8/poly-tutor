import { browser, dev } from '$app/environment'
import { getSupabase, getSession } from '$lib/supabase'
import { createUserStore } from '$lib/supabase/user'
import { WordStatus, type UserVocabulary, type Sentence } from '$lib/types.js'
import { createPersistedStore } from 'svelte-pieces'

export const load = async ({data: { access_token, refresh_token }, params: { learning }}) => {
  if (browser && dev)
    await enableMocking()

  const supabase = getSupabase()
  const authResponse = await getSession({ supabase, access_token, refresh_token })
  const user = createUserStore({ supabase, authResponse })
  const starter_vocab: UserVocabulary = {
    '貴州': {status: WordStatus.known},
  }
  const user_vocabulary = createPersistedStore<UserVocabulary>(`vocabulary_${authResponse?.data?.user?.id || 'no_user'}`, starter_vocab, true)

  if (browser) {
    const { api } = await import('$lib/analysis/expose-analysis-worker')
    api.set_user_vocabulary(starter_vocab) // TODO: update on changes
  }

  async function analyze_and_emphasize_sentences(sentences: Sentence[]) {
    const { api } = await import('$lib/analysis/expose-analysis-worker')
    // TODO: analyze_and_emphasize English words
    if (learning !== 'zh-TW' && learning !== 'zh-CN') return sentences
    return await api.analyze_and_emphasize_chinese_sentences({sentences, locale: learning})
  }

  async function analyze_string(text: string) {
    if (!browser) return text
    const { api } = await import('$lib/analysis/expose-analysis-worker')
    // TODO: analyze English string
    if (learning !== 'zh-TW' && learning !== 'zh-CN') return text
    return await api.analyze_chinese_string(text, learning)
  }

  async function analyze_sentences(sentences: Sentence[]) {
    if (!browser) return sentences
    const { api } = await import('$lib/analysis/expose-analysis-worker')
    // TODO: analyze English sentences
    if (learning !== 'zh-TW' && learning !== 'zh-CN') return sentences
    return await api.analyze_chinese_sentences(sentences, learning)
  }

  return { supabase, authResponse, user, user_vocabulary, analyze_string, analyze_sentences, analyze_and_emphasize_sentences }
}

async function enableMocking() {
  // TODO: only enable for actual dev, not for playwright tests
  // const { worker } = await import('$lib/mocks/msw/browser')
  // return worker.start({onUnhandledRequest: 'bypass'})
}
