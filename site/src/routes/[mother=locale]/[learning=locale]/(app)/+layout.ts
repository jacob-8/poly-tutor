import { get_analysis_functions } from '$lib/analysis'
import type { LanguageCode } from '$lib/i18n/locales.js'
import { getSupabase, getSession } from '$lib/supabase'
import { createUserStore } from '$lib/supabase/user'
import  type { ChineseEmphasisLimits, Settings } from '$lib/types'
import { createVocabStore } from '$lib/vocab/vocabulary'
import { createPersistedStore } from 'svelte-pieces/index'

export const load = async ({data: { access_token, refresh_token }, params: { learning }}) => {
  const settings = createPersistedStore<Settings>('settings_01.03.24', {font_size_em: 1.5, show_definition: true, show_pronunciation: true}, true)
  const emphasis_limits = createPersistedStore<ChineseEmphasisLimits>('emphasis_limits_01.03.24', {high_view_count_max: 10, common_in_this_context_max: 10, improve_pronunciation_or_tone_max: 2}, true)

  const supabase = getSupabase()
  const authResponse = await getSession({ supabase, access_token, refresh_token })

  const user = createUserStore({ supabase, authResponse })
  const user_vocabulary = createVocabStore({ supabase, authResponse, language: learning.replace(/-.*/, '') as LanguageCode, log: true })

  const { analyze_sentences, split_sentences, split_string } = await get_analysis_functions({learning, user_vocabulary, emphasis_limits})

  return { settings, emphasis_limits, supabase, authResponse, user, user_vocabulary, split_string, split_sentences, analyze_sentences }
}
