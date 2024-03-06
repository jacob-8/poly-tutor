import type { LanguageCode } from '$lib/i18n/locales'
import type { PageLoad } from './$types'

export const load = (async ({parent, params: { learning }}) => {
  const { supabase } = await parent()
  const language = learning.replace(/-.*/, '') as LanguageCode

  const { data: channels, error } = await supabase
    .from('user_youtube_channels')
    .select()
    .eq('language', language)
    .order('last_visit', { ascending: false })

  if (error)
    throw new Error(error.message)
  return {
    channels
  }
}) satisfies PageLoad
