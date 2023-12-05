import type { Sentence } from '$lib/types'

export function merge_translations(lineSeparatedTranslations: string, sentences: Sentence[]): Sentence[] {
  const translations = lineSeparatedTranslations.split('\n')
  const mergedSentences: Sentence[] = []

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i]
    const translation = translations[i]

    const mergedSentence: Sentence = {
      ...sentence,
      machine_translation: {
        en: translation,
      },
    }

    mergedSentences.push(mergedSentence)
  }

  return mergedSentences
}

if (import.meta.vitest) {
  describe(merge_translations, () => {
    test('adds on machine_translation', () => {
      const lineSeparatedTranslations = `My tutor is busy today.
My tutor is busy tomorrow.
`
      const sentences: Sentence[] = [{
        text: '今天我的導師很忙。',
        syntax: {},
      },
      {
        text: '明天我的導師很忙。',
      }]

      const expected: Sentence[] = [{
        text: '今天我的導師很忙。',
        syntax: {},
        machine_translation: {
          en: 'My tutor is busy today.',
        }
      },
      {
        text: '明天我的導師很忙。',
        machine_translation: {
          en: 'My tutor is busy tomorrow.',
        }
      }]
      expect(merge_translations(lineSeparatedTranslations, sentences)).toEqual(expected)
    })
  })
}
