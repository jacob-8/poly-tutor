import type { LanguageCode } from '$lib/i18n/locales'
import type { Sentence } from '$lib/types'

const GPT3_5_INPUT_COST_PER_TOKEN = 0.0005 / 1000
// const GPT3_5_OUTPUT_COST_PER_1000 = 0.0015
// const GPT4_INPUT_COST_PER_1000 = 0.01
// const GPT4_OUTPUT_COST_PER_1000 = 0.03

const GPT3_5_MAX_TOKENS = 16000

const ENGLISH_TOKENS_PER_WORD = 1.3
const CHINESE_TOKENS_PER_CHARACTER = 2

export function calculate_tokens_cost({ sentences, language }: { sentences: Sentence[], language: LanguageCode}): string {
  let tokens: number

  if (language === 'en') {
    let words = 0
    for (const sentence of sentences)
      words += sentence.text.split(' ').length

    tokens = words * ENGLISH_TOKENS_PER_WORD
  }

  if (language === 'zh') {
    let characters = 0
    for (const sentence of sentences)
      characters += sentence.text.length

    tokens = characters * CHINESE_TOKENS_PER_CHARACTER
  }

  if (tokens > GPT3_5_MAX_TOKENS)
    return `Too many tokens: ${tokens} > ${GPT3_5_MAX_TOKENS}`

  const cost = (tokens * GPT3_5_INPUT_COST_PER_TOKEN).toFixed(4)
  const cost_without_trailing_zero = cost.replace(/\.?0+$/, '')

  return `$${cost_without_trailing_zero}`
}

if (import.meta.vitest) {
  describe(calculate_tokens_cost, () => {
    test('Chinese', () => {
      const sentences: Sentence[] = [
        { text: '这是一个句子。' },
        { text: '这是另一个句子。' },
      ]
      expect(calculate_tokens_cost({sentences, language: 'zh'})).toMatchInlineSnapshot(`"$0"`)
    })

    test('English', () => {
      const sentences: Sentence[] = [
        { text: 'This is a sentence.' },
        { text: 'This is another sentence.' },
      ]
      expect(calculate_tokens_cost({sentences, language: 'en'})).toMatchInlineSnapshot(`"$0"`)
    })
  })
}
