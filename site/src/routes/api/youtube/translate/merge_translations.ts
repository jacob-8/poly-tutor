import type { LocaleCode } from '$lib/i18n/locales'
import type { Sentence } from '$lib/types'

export function merge_translations({ line_separated_translations, sentences, locale}: {line_separated_translations: string, sentences: Sentence[], locale: LocaleCode}): Sentence[] {
  const translations = line_separated_translations.split('\n')
  const mergedSentences: Sentence[] = []

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i]
    const translation = translations[i]

    const mergedSentence: Sentence = {
      ...sentence,
      translation: {
        ...sentence.translation,
        [locale]: translation,
      },
    }

    mergedSentences.push(mergedSentence)
  }

  return mergedSentences
}

if (import.meta.vitest) {
  describe(merge_translations, () => {
    test('keeps existing fields', () => {
      const sentences: Sentence[] = [
        { text: '今天我的導師很忙。',
          translation: {
            // @ts-expect-error - Spanish not supported
            es: 'Mi tutor está ocupado hoy.',
          } },
        { text: '明天我的導師很忙。' }
      ]
      const line_separated_translations = 'My tutor is busy today.\nMy tutor is busy tomorrow.'

      const expected: Sentence[] = [{
        text: '今天我的導師很忙。',
        translation: {
          en: 'My tutor is busy today.',
          // @ts-expect-error - Spanish not supported
          es: 'Mi tutor está ocupado hoy.'
        }
      },
      {
        text: '明天我的導師很忙。',
        translation: {
          en: 'My tutor is busy tomorrow.',
        }
      }]
      expect(merge_translations({line_separated_translations, sentences, locale: 'en'})).toEqual(expected)
    })

    test('handles Chinese translation', () => {
      const sentences: Sentence[] = [
        { text: 'My tutor is busy today.' },
        { text: 'My tutor is busy tomorrow.' }
      ]
      const line_separated_translations = '今天我的導師很忙。\n明天我的導師很忙。'

      const expected: Sentence[] = [{
        text: 'My tutor is busy today.',
        translation: {
          'zh-TW': '今天我的導師很忙。',
        }
      },
      {
        text: 'My tutor is busy tomorrow.',
        translation: {
          'zh-TW': '明天我的導師很忙。',
        }
      }]
      expect(merge_translations({line_separated_translations, sentences, locale: 'zh-TW'})).toEqual(expected)
    })
  })
}
