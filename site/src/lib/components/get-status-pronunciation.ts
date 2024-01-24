import { WordStatus } from '$lib/types'
import { find_tone, tone_marker } from '$lib/utils/find-tone'

export function get_status_pronunciation(pinyin: string, status: WordStatus) {
  if (!pinyin || status === WordStatus.known || status === WordStatus.wordlist)
    return ' '
  if (status === WordStatus.tone)
    return pinyin.split(' ').map(find_tone).map(tone_marker).join('')
  return pinyin.replaceAll(' ', '')
}
