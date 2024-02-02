export function split_into_sentences(text: string): string[] {
  const sentences: string[] = []
  const sentence_ending_punctuation = /([.?!。？！\n])/

  text.split(sentence_ending_punctuation).reduce((acc, part) => {
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
  test(split_into_sentences, () => {
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
