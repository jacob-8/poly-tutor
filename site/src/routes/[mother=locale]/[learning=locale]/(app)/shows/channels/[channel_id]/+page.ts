import type { LanguageCode } from '$lib/i18n/locales'
import type { PageLoad } from './$types'

export const load = (async ({ parent, params: { learning, channel_id } }) => {
  const { supabase } = await parent()
  const language = learning.replace(/-.*/, '') as LanguageCode

  const { data: channel_youtubes, error: youtubes_load_error } = await supabase
    .from('youtubes')
    .select(`
      id,
      language,
      title,
      description,
      duration_seconds,
      chapters,
      created_at,
      channel_id,
      channel:youtube_channels(
        id,
        title,
        description,
        thumbnail_url
      )
    `)
    .eq('language', language)
    .eq('channel_id', channel_id)
    .order('created_at', { ascending: false })
  if (youtubes_load_error)
    console.error({youtubes_load_error})

  return {
    channel_youtubes
  }
}) satisfies PageLoad
