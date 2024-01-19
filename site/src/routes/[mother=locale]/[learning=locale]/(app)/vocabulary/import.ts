import type { Supabase } from '$lib/supabase/database.types'
import type { TablesInsert } from '$lib/supabase/generated.types'
import { WordStatus } from '$lib/types'
import { curious, known, pronunciation, todo, tone } from '$lib/mocks/data/j-words'

export async function add_vocab(supabase: Supabase) {
  const updates: TablesInsert<'word_updates'>[] = []
  for (const word of curious) {
    updates.push({
      word,
      views: 1,
      language: 'zh',
      status: WordStatus.unknown,
    })
  }

  for (const word of todo) {
    updates.push({
      word,
      views: 3,
      language: 'zh',
      status: WordStatus.unknown,
    })
  }

  for (const word of pronunciation) {
    updates.push({
      word,
      views: 10,
      language: 'zh',
      status: WordStatus.pronunciation,
    })
  }

  for (const word of tone) {
    updates.push({
      word,
      views: 20,
      language: 'zh',
      status: WordStatus.tone,
    })
  }

  for (const word of known) {
    updates.push({
      word,
      views: 30,
      language: 'zh',
      status: WordStatus.known,
    })
  }

  console.info({updates})
  const { error } = await supabase.from('word_updates').insert(updates)
  if (error) console.error(error)
}
