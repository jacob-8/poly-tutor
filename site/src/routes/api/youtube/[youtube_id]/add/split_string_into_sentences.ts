export function split_into_sentences(text: string): string[] {
  const sentences: string[] = []
  const sentence_ending_punctuation = /([.?!。？！\n])/
  const parts = text.split(sentence_ending_punctuation)
  if (parts.length === 1)
    return [text]

  parts.reduce((acc, part) => {
    if (sentence_ending_punctuation.test(part)) {
      if (part !== '\n')
        acc += part

      if (acc.trim())
        sentences.push(acc.trim())

      return ''
    }
    return acc + part
  }, '')

  return sentences
}


if (import.meta.vitest) {
  describe(split_into_sentences, () => {
    test('no punctuation', () => {
      const sentence_with_no_punctuation = '宋尚节传 Life of John Sung | 刘翼凌 | 有声书'
      expect(split_into_sentences(sentence_with_no_punctuation)).toEqual([sentence_with_no_punctuation])
    })
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
}
