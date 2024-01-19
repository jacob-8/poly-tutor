import type { ECDictEntry } from '$lib/types'
import { csvParse } from 'd3-dsv'

export async function get_english_to_chinese_dictionary(): Promise<Record<string, ECDictEntry>> {
  const url = '/dictionaries/ecdict-simplified.csv'
  const response = await fetch(url)
  const csv = await response.text()
  const downloaded_entries = csvParse(csv) as unknown as ECDictEntry[]
  return downloaded_entries.reduce((acc, entry) => {
    if (entry.word in acc)
      acc[entry.word].translation = `${acc[entry.word].translation}/${entry.translation}`
    else
      acc[entry.word] = entry
    return acc
  }, {})
}
