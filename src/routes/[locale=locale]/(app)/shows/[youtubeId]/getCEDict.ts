import type { CEDictEntry } from '$lib/types'
import { csvParse } from 'd3-dsv'

export async function getCEDict() {
  if (typeof window === 'undefined') return {}
  const entries: Record<string, CEDictEntry> = {}
  const url = '/dictionaries/cedict_hsk_zhuyin_examples.csv'
  const response = await fetch(url)
  const csv = await response.text()
  const downloaded_entries = csvParse(csv) as CEDictEntry[]
  for (const entry of downloaded_entries)
    entries[entry.traditional] = augmentEntry(entry)
  return entries
}

function augmentEntry(entry: CEDictEntry) {
  entry.definitionsArray = entry.definitions.split('/')
  entry.definitionsArray.forEach((def, index) => {
    if (def.includes('surname ') || def.startsWith('variant') || def.startsWith('old variant'))
      entry.definitionsArray.push(entry.definitionsArray.splice(index, 1)[0])
  })

  entry.definitions = entry.definitions.replace(/\//g, ' • ')
  entry.adjustedWeight = +entry.weight
  if (
    entry.definitions.includes('surname ')
      || entry.definitions.startsWith('variant')
      || entry.definitions.startsWith('old variant')
      || entry.traditional.startsWith('妳')
  )
    entry.adjustedWeight = -1

  return entry
}
