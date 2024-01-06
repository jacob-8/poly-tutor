import { browser, dev } from '$app/environment'
import { getSupabase, getSession } from '$lib/supabase'
import { createUserStore } from '$lib/supabase/user'
import  type { ChineseEmphasisLimits, Sentence, Settings } from '$lib/types'
import { createVocabStore } from '$lib/vocab/vocabulary'
import { createPersistedStore } from 'svelte-pieces/index'
import { get } from 'svelte/store'

export const load = async ({data: { access_token, refresh_token }, params: { learning }}) => {
  if (browser && dev)
    await enableMocking()

  const settings = createPersistedStore<Settings>('settings_01.03.24', {font_size_em: 1.5, show_definition: true, show_pronunciation: true}, true)
  const emphasis_limits = createPersistedStore<ChineseEmphasisLimits>('emphasis_limits_01.03.24', {high_view_count_max: 10, common_in_this_context_max: 4, improve_pronunciation_or_tone_max: 2}, true)
  const supabase = getSupabase()
  const authResponse = await getSession({ supabase, access_token, refresh_token })
  const user = createUserStore({ supabase, authResponse })
  const user_vocabulary = createVocabStore({ supabase, authResponse })

  if (browser) {
    const { api } = await import('$lib/analysis/expose-analysis-worker')
    const vocab = get(user_vocabulary)
    api.set_user_vocabulary(vocab) // TODO: update on changes
  }

  async function split_string(text: string) {
    if (!browser) return text
    const { api } = await import('$lib/analysis/expose-analysis-worker')
    // TODO: analyze English string
    if (learning !== 'zh-TW' && learning !== 'zh-CN') return text
    return await api.split_chinese_string(text, learning)
  }

  async function split_sentences(sentences: Sentence[]) {
    if (!browser) return sentences
    const { api } = await import('$lib/analysis/expose-analysis-worker')
    // TODO: analyze English sentences
    if (learning !== 'zh-TW' && learning !== 'zh-CN') return sentences
    return await api.split_chinese_sentences({sentences, locale: learning})
  }

  async function analyze_sentences(sentences: Sentence[]) {
    const { api } = await import('$lib/analysis/expose-analysis-worker')
    // TODO: analyze_and_emphasize English words
    if (learning !== 'zh-TW' && learning !== 'zh-CN') return { sentences, study_words: null }
    const limits = get(emphasis_limits)
    return await api.analyze_chinese_sentences({sentences, locale: learning, emphasis_limits: limits})
  }

  return { settings, supabase, authResponse, user, user_vocabulary, split_string, split_sentences, analyze_sentences }
}

async function enableMocking() {
  // TODO: only enable for actual dev, not for playwright tests
  // const { worker } = await import('$lib/mocks/msw/browser')
  // return worker.start({onUnhandledRequest: 'bypass'})
}
