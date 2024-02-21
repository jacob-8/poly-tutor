export function split_into_sentences(text: string): string[] {
  const sentences: string[] = []
  const sentence_ending_punctuation_but_not_url_periods = /(\.\s|[?!。？！\n])/g // make sure periods have a space after them to avoid urls
  const parts = text.split(sentence_ending_punctuation_but_not_url_periods)
  if (parts.length === 1)
    return [text]

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      const words = parts[i]
      const punctuation = parts[i + 1] || ''
      const sentence = words.trim() + punctuation.trim()
      if (sentence)
        sentences.push(sentence)
    }
  }

  return sentences
}


if (import.meta.vitest) {
  describe(split_into_sentences, () => {
    test('no punctuation', () => {
      const sentence_with_no_punctuation = '一位老人騎驢帶回200棵蘋果樹苗，讓村莊煥然一新 – 真是太神奇了 | 有声书'
      expect(split_into_sentences(sentence_with_no_punctuation)).toEqual([sentence_with_no_punctuation])
    })

    test('skips urls', () => {
      const sentence_with_url = '回200棵蘋果樹苗 https://foo.com. And look here for more.'
      expect(split_into_sentences(sentence_with_url)).toEqual(['回200棵蘋果樹苗 https://foo.com.', 'And look here for more.'])
    })

    test('multiple sentences and newlines', () => {
      const text = 'This is a sentence, comma does not split. 这是一句话。Here\'s another one! 还有另外一个！\nAnd a new line.\n\n and two lines.'
      expect(split_into_sentences(text)).toEqual([
        'This is a sentence, comma does not split.',
        '这是一句话。',
        'Here\'s another one!',
        '还有另外一个！',
        'And a new line.',
        'and two lines.'
      ])
    })
  })

}
