// <button type="button" on:click={add_vocab}>Add vocab</button>

// export const curious = ''
// export const todo = ''
// export const pronunciation = ''
// export const tone = ''
// export const known = ''

// async function add_vocab() {
//   const updates: TablesInsert<'word_updates'>[] = []
//   for (const word of curious.split(',')) {
//     updates.push({
//       word,
//       views: 1,
//       language: 'zh',
//       status: WordStatus.unknown,
//     })
//   }

//   for (const word of todo.split(',')) {
//     updates.push({
//       word,
//       views: 3,
//       language: 'zh',
//       status: WordStatus.unknown,
//     })
//   }

//   for (const word of pronunciation.split(',')) {
//     updates.push({
//       word,
//       views: 10,
//       language: 'zh',
//       status: WordStatus.pronunciation,
//     })
//   }

//   for (const word of tone.split(',')) {
//     updates.push({
//       word,
//       views: 20,
//       language: 'zh',
//       status: WordStatus.tone,
//     })
//   }

//   for (const word of known.split(',')) {
//     updates.push({
//       word,
//       views: 30,
//       language: 'zh',
//       status: WordStatus.known,
//     })
//   }

//   console.log({updates})
//   const { error } = await data.supabase.from('word_updates').insert(updates)
//   if (error) console.error(error)
// }
