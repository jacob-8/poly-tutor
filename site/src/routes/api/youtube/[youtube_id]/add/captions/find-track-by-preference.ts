import type { LocaleCode } from '$lib/i18n/locales'
import type { YoutubeCaptionTrack } from './get-captions'

const zh_TW_code_preferences = ['zh-TW', 'zh-Hant', 'zh', 'zh-CN', 'zh-Hans']
const zh_CN_code_preferences = ['zh-CN', 'zh-Hans', 'zh', 'zh-TW', 'zh-Hant']

export function find_track_by_preference(tracks: YoutubeCaptionTrack[], locale: LocaleCode): YoutubeCaptionTrack {
  if (!tracks.length)  {
    console.info('no caption tracks found')
    return
  }

  if (locale === 'en') {
    const preferredTrack = tracks.find(({ language_code }) => language_code.startsWith('en'))
    if (preferredTrack && !preferredTrack.language?.includes('auto-generated'))
      return preferredTrack
  }

  if (locale === 'zh-TW') {
    for (const code of zh_TW_code_preferences) {
      const preferredTrack = tracks.find(({ language_code }) => language_code === code)
      if (preferredTrack)
        return preferredTrack
    }

    const preferredTrack = tracks.find(({ language_code }) => language_code.startsWith('zh'))
    if (preferredTrack)
      return preferredTrack
  }

  if (locale === 'zh-CN') {
    for (const code of zh_CN_code_preferences) {
      const preferredTrack = tracks.find(({ language_code }) => language_code === code)
      if (preferredTrack)
        return preferredTrack
    }

    const preferredTrack = tracks.find(({ language_code }) => language_code.startsWith('zh'))
    if (preferredTrack)
      return preferredTrack
  }

  console.info(`No track found for locale: ${locale}. Tracks that exist are: ${tracks.map(({ language_code, language }) => `${language_code} ${language}`).join(', ')}`)
}

if (import.meta.vitest) {
  describe(find_track_by_preference, () => {
    test('traditional Chinese learners receive preference for traditional script', () => {
      const tracks = [
        { language_code: 'zh' },
        { language_code: 'zh-TW' },
      ] as YoutubeCaptionTrack[]
      expect(find_track_by_preference(tracks, 'zh-TW')).toEqual(tracks[1])
    })

    test('simplified Chinese learners receive preference for simplified script', () => {
      const tracks = [
        { language_code: 'zh-TW' },
        { language_code: 'zh-CN' },
      ] as YoutubeCaptionTrack[]
      expect(find_track_by_preference(tracks, 'zh-CN')).toEqual(tracks[1])
    })

    test('English learners receive preference for English script', () => {
      const tracks = [
        { language_code: 'zh-TW' },
        { language_code: 'en' },
      ] as YoutubeCaptionTrack[]
      expect(find_track_by_preference(tracks, 'en')).toEqual(tracks[1])
    })

    test('does not use English auto-generated tracks due to bad timings', () => {
      const tracks = [
        { language_code: 'en', language: 'English (auto-generated)' },
      ] as YoutubeCaptionTrack[]
      expect(find_track_by_preference(tracks, 'en')).toBeFalsy()
    })

    test('return undefined if no track found', () => {
      const tracks = [
        { language_code: 'fr' },
        { language_code: 'de' },
      ] as YoutubeCaptionTrack[]
      expect(find_track_by_preference(tracks, 'zh-CN')).toBeFalsy()
    })
  })
}
