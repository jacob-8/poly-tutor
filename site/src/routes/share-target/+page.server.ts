import { redirect } from '@sveltejs/kit'
import { DEFAULT_LOCALE, findSupportedLocaleFromAcceptedLanguages, getSupportedLocale } from '$lib/i18n/locales'
import { ResponseCodes } from '$lib/response-codes'
import { get_youtube_video_id } from '../[mother=locale]/[learning=locale]/(app)/shows/get-youtube-video-id'
import { get_youtube_playlist_id } from '../[mother=locale]/[learning=locale]/(app)/shows/get-youtube-playlist-id'

export const load = (({ cookies, request, url }) => {
  const chosenMotherLocale = cookies.get('mother-locale')
  const acceptedLanguage = findSupportedLocaleFromAcceptedLanguages(request.headers.get('accept-language'))
  const motherLocale = getSupportedLocale(chosenMotherLocale || acceptedLanguage) || DEFAULT_LOCALE
  const chosenLearningLocale = cookies.get('learning-locale')
  const learningLocale = chosenLearningLocale || (motherLocale === 'en' ? 'zh-TW' : 'en')

  const title = url.searchParams.get('title')
  check_if_url_is_youtube_video_or_playlist(title)
  const text = url.searchParams.get('text')
  check_if_url_is_youtube_video_or_playlist(text)
  const url_maybe_on_ios = url.searchParams.get('url')
  check_if_url_is_youtube_video_or_playlist(url_maybe_on_ios)

  function check_if_url_is_youtube_video_or_playlist(url: string) {
    const youtube_id = get_youtube_video_id(url)
    if (youtube_id)
      throw redirect(ResponseCodes.TEMPORARY_REDIRECT, `/${motherLocale}/${learningLocale}/shows/${youtube_id}`)

    const playlist_id = get_youtube_playlist_id(url)
    if (playlist_id)
      throw redirect(ResponseCodes.TEMPORARY_REDIRECT, `/${motherLocale}/${learningLocale}/shows/playlists/${playlist_id}`)
  }

  throw redirect(ResponseCodes.TEMPORARY_REDIRECT, `/${motherLocale}/${learningLocale}`)
})
