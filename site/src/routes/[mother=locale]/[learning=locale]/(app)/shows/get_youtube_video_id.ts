export const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/

export function get_youtube_video_id(url_or_id: string): string | null {
  if (url_or_id?.match(YOUTUBE_VIDEO_ID_PATTERN))
    return url_or_id

  const pattern = /(?:youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|watch\?.*&v=)(?<video_id>[^#&?]*).*/
  const match = url_or_id?.match(pattern)

  if (match?.groups?.video_id?.match(YOUTUBE_VIDEO_ID_PATTERN))
    return match.groups.video_id

  return null
}

if (import.meta.vitest) {
  describe(get_youtube_video_id, () => {
    const testCases = [
      { url: 'youtube.com/watch?v=dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
      { url: 'www.youtube.com/watch?v=dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
      { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
      { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ?list=somethingelse', expectedId: 'dQw4w9WgXcQ' },
      { url: 'https://youtu.be/dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
      { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
      { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0', expectedId: 'dQw4w9WgXcQ' },
      { url: 'https://www.youtube.com/v/dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
      { url: 'http://www.youtube.com/user/FAMOUSPERSON#p/a/u/1/dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },

      { url: 'https://www.youtube.com', expectedId: null },
      { url: 'https://www.youtube.com/watch', expectedId: null },
      { url: 'https://www.youtube.com/watch?v=', expectedId: null },
      { url: 'https://www.youtube.com/watch?v=invalid', expectedId: null },
      { url: 'https://invalid_url.com', expectedId: null },
      { url: undefined, expectedId: null },
    ]

    test.each(testCases)('returns the correct video ID for URL: %p', ({ url, expectedId }) => {
      expect(get_youtube_video_id(url)).toEqual(expectedId)
    })

    test('handles just an id', () => {
      const video_id = 'tvdB5GG22j0'
      expect(get_youtube_video_id(video_id)).toEqual(video_id)
    })
  })
}
