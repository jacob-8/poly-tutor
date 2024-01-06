import type { CEDictEntry } from '$lib/types'
// import { find_tone } from '$lib/utils/find-tone'
import { csvParse } from 'd3-dsv'

export async function get_chinese_to_english_dictionary() {
  const url = '/dictionaries/cedict_pinyin.csv'
  const response = await fetch(url)
  const csv = await response.text()
  const downloaded_entries = csvParse(csv) as unknown as CEDictEntry[]
  return prepare_entries(downloaded_entries)
}

export function prepare_entries(csv_rows: CEDictEntry[]): Record<string, CEDictEntry> {
  const entries: Record<string, CEDictEntry> = {}
  for (const entry of csv_rows) {
    if (!entries[entry.traditional]) {
      entries[entry.traditional] = {
        ...entry,
        // definitions_array: sort_definitions(entry.definitions), (100% slower)
        // tones: entry.pinyin.split(' ').map(syllable => find_tone(syllable)), (30% slower)
      }
    } else {
      entries[entry.traditional].definitions = `${entries[entry.traditional].definitions}/${entry.definitions}`
      // entries[entry.traditional].definitions_array = [...entries[entry.traditional].definitions_array, ...sort_definitions(entry.definitions)]
    }
  }

  for (const entry of Object.values(entries)) {
    if (entry.simplified && !entries[entry.simplified])
      entries[entry.simplified] = entry
  }

  return entries
}



if (import.meta.vitest) {
  describe(prepare_entries, () => {
    test('combines two entries for the same traditional character', () => {
      const entries: CEDictEntry[] = [
        { traditional: '你',
          pinyin: 'nǐ',
          definitions: 'you (informal)' },
        { traditional: '你',
          pinyin: 'nǐ',
          definitions: 'you (female)/variant of 你[nǐ]' },
        { traditional: '好',
          pinyin: 'hǎo',
          definitions: 'good/well/proper/good to/easy' },
      ]

      const result = prepare_entries(entries)
      expect(result['你'].definitions).toEqual('you (informal)/you (female)/variant of 你[nǐ]')
      expect(Object.keys(result)).toEqual(['你', '好'])
    })

    const entries: CEDictEntry[] = [
      { traditional: '你們',
        simplified: '你们',
        pinyin: 'nǐ men',
        definitions: 'you (plural)/CL:個|个[gè]' },
      { traditional: '你',
        pinyin: 'nǐ',
        definitions: 'you' },
      { traditional: '們',
        pinyin: 'men',
        definitions: 'plural marker for pronouns, and nouns referring to individuals' },
    ]

    test('adds entries for simplified form', () => {
      const result = prepare_entries(entries)
      expect(result['你們']).toEqual(result['你们'])
    })

    // test('adds tone numbers', () => {
    //   const result = prepare_entries(entries)
    //   expect(result['你們'].tones).toEqual([3, 5])
    // })
  })
}
