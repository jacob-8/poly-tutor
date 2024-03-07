export function get_youtube_playlist_id(url: string): string | null {
  if (!url) return null

  const playlist_pattern = /youtube\.com\/playlist\?list=(?<playlist_id>[a-zA-Z0-9_-]+)(?:&|$)/
  const match = url.match(playlist_pattern)

  return match?.groups?.playlist_id || null
}

if (import.meta.vitest) {
  describe(get_youtube_playlist_id, () => {
    test('returns simplest playlist url', () => {
      expect(get_youtube_playlist_id('https://www.youtube.com/playlist?list=PLz_e7apcBzpuVEVC-_pvHDKLq7T_0MbcZ')).toEqual('PLz_e7apcBzpuVEVC-_pvHDKLq7T_0MbcZ')
    })

    test('returns playlist id even with other params', () => {
      expect(get_youtube_playlist_id('https://www.youtube.com/playlist?list=PLz_e7apcBzpuVEVC-_pvHDKLq7T_0MbcZ&foo=bar')).toEqual('PLz_e7apcBzpuVEVC-_pvHDKLq7T_0MbcZ')
    })

    test('returns null on another url', () => {
      expect(get_youtube_playlist_id('https://www.youtube.com/')).toEqual(null)
    })
  })
}
