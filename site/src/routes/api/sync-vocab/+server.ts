import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { ResponseCodes } from '$lib/responseCodes'
import type { TablesInsert } from '$lib/supabase/generated.types'
import { WordStatus } from '$lib/types'
import { getAdminSupabaseClient } from '$lib/supabase/admin'

interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

interface Status {
  pronunciation?: Timestamp;
  known?: Timestamp;
  tone?: Timestamp;
  curious?: Timestamp;
  todo?: Timestamp;
}

interface Word {
  createdBy: string;
  updatedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: Status;
  id: string;
}

export const POST: RequestHandler = async ({ locals: { getSession }, request, fetch }) => {
  const { data: session_data, error: _error } = await getSession()
  if (_error || !session_data?.user)
    error(ResponseCodes.UNAUTHORIZED, { message: _error.message || 'Unauthorized' })

  const { url } = await request.json()
  // const url = '/j-import.json'
  const response = await fetch(url)
  const json_string = await response.text()
  const words = JSON.parse(json_string) as Word[]

  const count = await reset_and_migrate_vocab(words, session_data.user.id)
  return json(`Migrated ${count} words for ${url}`)
}

async function reset_and_migrate_vocab(words: Word[], user_id: string) {
  const adminSupabase = getAdminSupabaseClient()
  const { error: deleteError } = await adminSupabase.from('word_updates')
    .delete()
    .eq('created_by', user_id)
  if (deleteError) return console.error(deleteError)

  const updates: TablesInsert<'word_updates'>[] = []
  for (const word of words) {
    if (!word.status)
      continue
    if (word.status.curious) {
      updates.push({
        word: word.id,
        created_at: new Date(word.status.curious.seconds * 1000 + 1).toISOString(),
        created_by: user_id,
        views: 1,
        language: 'zh',
        status: WordStatus.unknown,
      })
    }
    if (word.status.todo) {
      updates.push({
        word: word.id,
        created_at: new Date(word.status.todo.seconds * 1000 + 1).toISOString(),
        created_by: user_id,
        views: 3,
        language: 'zh',
        status: WordStatus.unknown,
      })
    }
    if (word.status.pronunciation) {
      updates.push({
        word: word.id,
        created_at: new Date(word.status.pronunciation.seconds * 1000 + 1).toISOString(),
        created_by: user_id,
        views: 10,
        language: 'zh',
        status: WordStatus.pronunciation,
      })
    }
    if (word.status.tone) {
      updates.push({
        word: word.id,
        created_at: new Date(word.status.tone.seconds * 1000 + 1).toISOString(),
        created_by: user_id,
        views: 20,
        language: 'zh',
        status: WordStatus.tone,
      })
    }
    if (word.status.known) {
      updates.push({
        word: word.id,
        created_at: new Date(word.status.known.seconds * 1000 + 1).toISOString(),
        created_by: user_id,
        views: 30,
        language: 'zh',
        status: WordStatus.known,
      })
    }
  }

  console.info({updates})
  const { error } = await adminSupabase.from('word_updates').insert(updates)
  if (error) return console.error(error)
  return updates.length
}

